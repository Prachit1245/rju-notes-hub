import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Keep-alive function triggered at:', new Date().toISOString())

    // Insert a new heartbeat record
    const { data: insertData, error: insertError } = await supabase
      .from('heartbeat')
      .insert({ message: 'auto-activity' })
      .select()

    if (insertError) {
      console.error('Error inserting heartbeat:', insertError)
      throw insertError
    }

    console.log('Inserted heartbeat record:', insertData)

    // Delete records older than 30 days to keep the table clean
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: deleteData, error: deleteError } = await supabase
      .from('heartbeat')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select()

    if (deleteError) {
      console.error('Error deleting old heartbeats:', deleteError)
      // Don't throw, this is not critical
    } else {
      console.log('Deleted old heartbeat records:', deleteData?.length || 0)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Keep-alive executed successfully',
        inserted: insertData?.length || 0,
        deleted: deleteData?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Keep-alive function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

