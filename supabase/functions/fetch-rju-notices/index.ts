import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching notices from RJU website...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the RJU homepage which has the Notice Board section
    const response = await fetch('https://rju.edu.np/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RJU website: ${response.status}`);
    }

    const html = await response.text();
    console.log(`Fetched HTML length: ${html.length}`);

    // Parse notices from the RJU homepage
    // The site uses gdlr-core-blog-grid with date + title links
    const notices = parseRJUNotices(html);
    console.log(`Parsed ${notices.length} total notices`);

    // Filter to only notices from the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const recentNotices = notices.filter(n => {
      const noticeDate = new Date(n.date);
      return noticeDate >= twoDaysAgo;
    });

    console.log(`Notices from last 2 days: ${recentNotices.length}`);

    // Store new notices in database
    let newCount = 0;
    for (const notice of recentNotices) {
      // Check if notice already exists by title
      const { data: existing } = await supabase
        .from('notices')
        .select('id')
        .eq('title', notice.title)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from('notices')
          .insert({
            title: notice.title,
            content: notice.content,
            category: notice.category,
            priority: 'normal',
            published_at: notice.date,
            expires_at: null,
            is_active: true,
          });

        if (error) {
          console.error('Error inserting notice:', error);
        } else {
          newCount++;
          console.log(`Inserted: ${notice.title}`);
        }
      }
    }

    // Clean up old notices (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await supabase
      .from('notices')
      .delete()
      .lt('published_at', thirtyDaysAgo.toISOString());

    return new Response(
      JSON.stringify({
        success: true,
        message: `Parsed ${notices.length} notices, ${recentNotices.length} from last 2 days, added ${newCount} new`,
        newNotices: newCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-rju-notices:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseRJUNotices(html: string) {
  const notices: Array<{ title: string; content: string; category: string; date: string }> = [];

  // The RJU site uses gdlr-core-item-list blocks for each notice
  // Each block has: date span with a link like "April 3, 2026" and an h3 title with link
  // Pattern: gdlr-core-item-list containing date + title
  const itemPattern = /<div class="gdlr-core-item-list[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
  const items = html.match(itemPattern) || [];

  console.log(`Found ${items.length} item-list blocks`);

  // Also try a simpler approach: find all blog-grid content wraps
  const gridPattern = /<div class="gdlr-core-blog-grid-content-wrap">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
  let gridMatch;

  while ((gridMatch = gridPattern.exec(html)) !== null) {
    try {
      const block = gridMatch[1];

      // Extract date - look for date link like "April 3, 2026"
      const dateLink = block.match(/<a href="https:\/\/rju\.edu\.np\/\d{4}\/\d{2}\/\d{2}\/">(.*?)<\/a>/i);
      let dateStr = '';
      if (dateLink) {
        dateStr = dateLink[1].trim(); // e.g. "April 3, 2026"
      }

      // Extract title
      const titleMatch = block.match(/<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!titleMatch) continue;

      const titleUrl = titleMatch[1];
      const title = cleanText(titleMatch[2]);

      if (!title || title.length < 5) continue;

      // Parse date
      let parsedDate: Date;
      try {
        parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = new Date();
        }
      } catch {
        parsedDate = new Date();
      }

      // Determine category
      let category = 'general';
      const titleLower = title.toLowerCase();
      const urlLower = titleUrl.toLowerCase();
      if (titleLower.includes('exam') || urlLower.includes('exam') || titleLower.includes('schedule')) {
        category = 'exam';
      } else if (titleLower.includes('result')) {
        category = 'result';
      } else if (titleLower.includes('admission') || titleLower.includes('entrance')) {
        category = 'admission';
      } else if (titleLower.includes('vacancy') || titleLower.includes('job') || titleLower.includes('application')) {
        category = 'vacancy';
      } else if (titleLower.includes('event') || titleLower.includes('workshop') || titleLower.includes('seminar')) {
        category = 'event';
      }

      notices.push({
        title,
        content: `${title} - Published on ${dateStr}. View full notice at: ${titleUrl}`,
        category,
        date: parsedDate.toISOString(),
      });
    } catch (e) {
      console.error('Error parsing notice block:', e);
    }
  }

  // Deduplicate by title
  const seen = new Set<string>();
  return notices.filter(n => {
    if (seen.has(n.title)) return false;
    seen.add(n.title);
    return true;
  });
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
