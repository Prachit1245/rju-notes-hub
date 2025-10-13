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

    // Try multiple sources to get notices
    let notices: any[] = [];
    
    // Try fetching from the main page and examination page
    const urls = [
      'https://rju.edu.np/',
      'https://rju.edu.np/examination/',
      'https://rju.edu.np/notices/'
    ];
    
    for (const url of urls) {
      try {
        console.log(`Fetching from ${url}...`);
        const response = await fetch(url);
        const html = await response.text();
        const parsed = parseNoticesFromHTML(html);
        notices = notices.concat(parsed);
        console.log(`Parsed ${parsed.length} notices from ${url}`);
      } catch (e) {
        console.error(`Error fetching from ${url}:`, e);
      }
    }
    
    // Remove duplicates based on title
    notices = notices.filter((notice, index, self) =>
      index === self.findIndex((n) => n.title === notice.title)
    );
    
    // Filter notices from the past 10 days only
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    notices = notices.filter(notice => new Date(notice.date) >= tenDaysAgo);
    
    console.log(`Total unique notices from past 10 days: ${notices.length}`);

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
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
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
  
  // Try multiple patterns to extract notices
  const patterns = [
    // Pattern 1: Article with post class
    /<article[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/article>/gi,
    // Pattern 2: Div with notice or announcement class
    /<div[^>]*class="[^"]*notice[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    // Pattern 3: Links to notice pages
    /<a[^>]*href="([^"]*notice[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    // Pattern 4: Table rows with notice data
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    
    for (const match of matches) {
      try {
        // Extract title - try multiple patterns
        let title = '';
        const titlePatterns = [
          /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i,
          /<a[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/i,
          /<td[^>]*>([\s\S]*?)<\/td>/i
        ];
        
        for (const tp of titlePatterns) {
          const titleMatch = match.match(tp);
          if (titleMatch) {
            title = cleanText(titleMatch[1]);
            if (title.length > 10) break; // Good title found
          }
        }
        
        if (!title || title.length < 10) continue;
        
        // Extract date
        const dateMatch = match.match(/<time[^>]*datetime="([^"]*)"[^>]*>/i) || 
                         match.match(/(\d{4}-\d{2}-\d{2})/i) ||
                         match.match(/(\w+ \d{1,2}, \d{4})/);
        const dateStr = dateMatch ? dateMatch[1] : new Date().toISOString();
        
        // Extract content/excerpt
        const contentMatch = match.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const content = contentMatch ? cleanText(contentMatch[1]).substring(0, 500) : title;
        
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

        notices.push({
          title: title,
          content: content || title,
          category: category,
          date: new Date(dateStr).toISOString()
        });
      } catch (e) {
        console.error('Error parsing individual notice:', e);
        continue;
      }
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