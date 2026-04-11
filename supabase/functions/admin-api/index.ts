import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-requested-with, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAIL = "rjuadmin@notes.edu.np";
const ADMIN_PASSWORD = "RjuPrachit12@";

function validateAdmin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, adminEmail, adminPassword, ...payload } = await req.json();

    if (!validateAdmin(adminEmail, adminPassword)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let result;

    switch (action) {
      case "insert_note": {
        const { data, error } = await supabase
          .from("notes")
          .insert(payload.note)
          .select()
          .single();
        if (error) throw error;
        result = data;
        break;
      }

      case "delete_note": {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from("notes")
          .remove([`notes/${payload.fileName}`]);
        if (storageError) console.error("Storage delete error:", storageError);

        // Delete from database
        const { error: dbError } = await supabase
          .from("notes")
          .delete()
          .eq("id", payload.noteId);
        if (dbError) throw dbError;
        result = { success: true };
        break;
      }

      case "update_note": {
        const { error } = await supabase
          .from("notes")
          .update(payload.updates)
          .eq("id", payload.noteId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "insert_subject": {
        const { data, error } = await supabase
          .from("subjects")
          .insert(payload.subject)
          .select()
          .single();
        if (error) throw error;
        result = data;
        break;
      }

      case "find_subject": {
        const { data, error } = await supabase
          .from("subjects")
          .select("id")
          .eq("program_id", payload.programId)
          .eq("name", payload.name)
          .eq("semester", payload.semester)
          .maybeSingle();
        if (error) throw error;
        result = data;
        break;
      }

      case "generate_subject_code": {
        const { data, error } = await supabase
          .rpc("generate_unique_subject_code", {
            p_program_id: payload.programId,
            p_base_code: payload.baseCode || "CUSTOM",
          });
        if (error) throw error;
        result = { code: data };
        break;
      }

      case "upload_file": {
        // File uploads still happen via client storage (public bucket)
        // This action is not needed since storage is public
        result = { error: "Use client-side storage upload for public bucket" };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
