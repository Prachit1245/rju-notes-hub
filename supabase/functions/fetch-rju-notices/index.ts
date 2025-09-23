import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching notices from RJU website...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the notices page
    const response = await fetch('https://rju.edu.np/notices/');
    const html = await response.text();
    
    console.log('Successfully fetched RJU notices page');

    // Parse HTML to extract notice information
    const notices = parseNoticesFromHTML(html);
    console.log(`Parsed ${notices.length} notices from RJU website`);

    // Store new notices in database
    const newNotices = [];
    for (const notice of notices) {
      // Check if notice already exists
      const { data: existingNotice } = await supabase
        .from('notices')
        .select('id')
        .eq('title', notice.title)
        .single();

      if (!existingNotice) {
        const { data, error } = await supabase
          .from('notices')
          .insert({
            title: notice.title,
            content: notice.content,
            category: notice.category,
            priority: 'normal',
            published_at: notice.date,
            expires_at: null,
            is_active: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting notice:', error);
        } else {
          newNotices.push(data);
          console.log(`Inserted new notice: ${notice.title}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${notices.length} notices, added ${newNotices.length} new notices`,
        newNotices: newNotices.length
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-rju-notices function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function parseNoticesFromHTML(html: string) {
  const notices = [];
  
  // Extract notice sections using regex patterns
  const noticePattern = /<article[^>]*class="[^"]*post[^"]*"[^>]*>[\s\S]*?<\/article>/gi;
  const matches = html.match(noticePattern) || [];
  
  for (const match of matches) {
    try {
      // Extract title
      const titleMatch = match.match(/<h[1-6][^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h[1-6]>/i);
      const title = titleMatch ? cleanText(titleMatch[1]) : '';
      
      // Extract date
      const dateMatch = match.match(/<time[^>]*datetime="([^"]*)"[^>]*>/i) || 
                       match.match(/(\w+ \d{1,2}, \d{4})/);
      const dateStr = dateMatch ? dateMatch[1] : new Date().toISOString();
      
      // Extract content/excerpt
      const contentMatch = match.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          match.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const content = contentMatch ? cleanText(contentMatch[1]).substring(0, 500) : '';
      
      // Determine category based on title content
      let category = 'general';
      const titleLower = title.toLowerCase();
      if (titleLower.includes('exam') || titleLower.includes('result')) {
        category = 'examinations';
      } else if (titleLower.includes('vacancy') || titleLower.includes('job')) {
        category = 'vacancy';
      } else if (titleLower.includes('admission') || titleLower.includes('entrance')) {
        category = 'admissions';
      }

      if (title) {
        notices.push({
          title: title,
          content: content || title,
          category: category,
          date: new Date(dateStr).toISOString()
        });
      }
    } catch (e) {
      console.error('Error parsing individual notice:', e);
      continue;
    }
  }
  
  return notices;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}