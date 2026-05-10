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

    const categoryId = await fetchNoticesCategoryId();
    const noticesApiUrl = categoryId
      ? `https://rju.edu.np/wp-json/wp/v2/posts?categories=${categoryId}&per_page=10&_embed`
      : 'https://rju.edu.np/wp-json/wp/v2/posts?per_page=10&_embed';

    // Fetch the latest RJU notices from the WordPress API
    const response = await fetch(noticesApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RJU website: ${response.status}`);
    }

    const posts = await response.json();
    console.log(`Fetched ${Array.isArray(posts) ? posts.length : 0} notice posts from WordPress API`);

    const notices = parseRJUNotices(posts);
    console.log(`Parsed ${notices.length} total notices`);

    // Store new notices in database
    let newCount = 0;
    for (const notice of notices) {
      // Check if notice already exists by title
      const { data: existing } = await supabase
        .from('notices')
        .select('id')
        .eq('title', notice.title)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('notices')
          .update({
            content: notice.content,
            category: notice.category,
            priority: 'normal',
            published_at: notice.date,
            is_active: true,
            image_url: notice.image_url,
            source_url: notice.source_url,
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating notice:', error);
        }
      } else {
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
            image_url: notice.image_url,
            source_url: notice.source_url,
          });

        if (error) {
          console.error('Error inserting notice:', error);
        } else {
          newCount++;
          console.log(`Inserted: ${notice.title}`);
        }
      }
    }

    const latestTitles = notices.map((notice) => notice.title);
    if (latestTitles.length > 0) {
      const { error: cleanupError } = await supabase
        .from('notices')
        .delete()
        .not('title', 'in', `(${latestTitles.map(escapePostgrestValue).join(',')})`);

      if (cleanupError) {
        console.error('Error cleaning up old notices:', cleanupError);
      }
    }

    // Clean up stale notices if the source returns fewer than 10 items
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    await supabase
      .from('notices')
      .delete()
      .lt('published_at', tenDaysAgo.toISOString());

    return new Response(
      JSON.stringify({
        success: true,
        message: `Parsed ${notices.length} notices and synced the latest 10, added ${newCount} new`,
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

async function fetchNoticesCategoryId() {
  try {
    const response = await fetch('https://rju.edu.np/wp-json/wp/v2/categories?search=notice&per_page=20', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const categories = await response.json();
    const noticesCategory = Array.isArray(categories)
      ? categories.find((category) => category?.slug === 'notices' || category?.name?.toLowerCase() === 'notices')
      : null;

    return noticesCategory?.id ?? null;
  } catch (error) {
    console.error('Unable to resolve notices category, falling back to latest posts:', error);
    return null;
  }
}

function parseRJUNotices(posts: any[]) {
  if (!Array.isArray(posts)) {
    return [];
  }

  return posts
    .map((post) => {
      const title = cleanText(post?.title?.rendered ?? '');
      const excerpt = cleanText(post?.excerpt?.rendered ?? post?.content?.rendered ?? '');
      const link = post?.link ?? 'https://rju.edu.np/notices/';
      const publishedAt = post?.date_gmt ? `${post.date_gmt}Z` : post?.date;

      if (!title || !publishedAt) {
        return null;
      }

      return {
        title,
        content: excerpt || `${title} - View full notice at: ${link}`,
        category: detectCategory(title, link),
        date: new Date(publishedAt).toISOString(),
      };
    })
    .filter((notice): notice is { title: string; content: string; category: string; date: string } => Boolean(notice))
    .slice(0, 10);
}

function detectCategory(title: string, link: string) {
  const titleLower = title.toLowerCase();
  const urlLower = link.toLowerCase();

  if (titleLower.includes('exam') || urlLower.includes('exam') || titleLower.includes('schedule')) {
    return 'exam';
  }

  if (titleLower.includes('result')) {
    return 'result';
  }

  if (titleLower.includes('admission') || titleLower.includes('entrance')) {
    return 'admission';
  }

  if (titleLower.includes('vacancy') || titleLower.includes('job') || titleLower.includes('application')) {
    return 'vacancy';
  }

  if (titleLower.includes('event') || titleLower.includes('workshop') || titleLower.includes('seminar')) {
    return 'event';
  }

  return 'general';
}

function escapePostgrestValue(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
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
