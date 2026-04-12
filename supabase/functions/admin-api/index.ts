import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-requested-with, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function validateManager(supabase: any, email: string, password: string) {
  const { data: manager, error } = await supabase
    .from("managers")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !manager) return null;

  // Verify password using pgcrypto crypt
  const { data: valid, error: cryptError } = await supabase.rpc("verify_manager_password", {
    p_email: email,
    p_password: password,
  });

  if (cryptError || !valid) return null;
  return manager;
}

async function generateNoteSeo(supabase: any, noteId: string) {
  // Fetch note with related data
  const { data: note } = await supabase.from("notes").select("*").eq("id", noteId).single();
  if (!note) return;

  const { data: subject } = await supabase.from("subjects").select("*").eq("id", note.subject_id).single();
  if (!subject) return;

  const { data: program } = await supabase.from("programs").select("*").eq("id", subject.program_id).single();
  const { data: faculty } = program
    ? await supabase.from("faculties").select("*").eq("id", program.faculty_id).single()
    : { data: null };

  const programName = program?.name || "University Program";
  const programCode = program?.code || "";
  const facultyName = faculty?.name || "University Faculty";
  const semester = subject.semester;
  const subjectName = subject.name;
  const subjectCode = subject.code;
  const noteTitle = note.title;
  const fileType = note.file_type?.split("/")[1]?.toUpperCase() || "PDF";
  const tags = (note.tags || []).join(", ");

  const seoTitle = `${noteTitle} - ${subjectName} | Sem ${semester} ${programCode} | RJU Notes`.slice(0, 60);

  const seoDescription = `Download free ${noteTitle} study notes for ${subjectName} (${subjectCode}), Semester ${semester}, ${programName}, ${facultyName} at Rajarshi Janak University. ${fileType} format. Quality study materials for RJU students.`.slice(0, 160);

  const keywordParts = [
    noteTitle, subjectName, subjectCode, `semester ${semester}`,
    programName, programCode, facultyName, "RJU notes",
    "Rajarshi Janak University", "study materials", "free notes",
    "download notes", fileType, tags
  ].filter(Boolean);
  const seoKeywords = keywordParts.join(", ").slice(0, 500);

  await supabase.from("notes").update({
    seo_title: seoTitle,
    seo_description: seoDescription,
    seo_keywords: seoKeywords,
  }).eq("id", noteId);
}

async function logAction(supabase: any, managerId: string, managerEmail: string, action: string, details: any = {}) {
  await supabase.from("audit_logs").insert({
    manager_id: managerId,
    manager_email: managerEmail,
    action,
    details,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, adminEmail, adminPassword, ...payload } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Validate manager credentials
    const manager = await validateManager(supabase, adminEmail, adminPassword);
    if (!manager) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result;

    switch (action) {
      // ── Note operations (admin + manager) ──
      case "insert_note": {
        const { data, error } = await supabase
          .from("notes")
          .insert(payload.note)
          .select()
          .single();
        if (error) throw error;
        await logAction(supabase, manager.id, manager.email, "insert_note", { noteTitle: payload.note?.title });
        result = data;
        break;
      }

      case "delete_note": {
        const { error: storageError } = await supabase.storage
          .from("notes")
          .remove([`notes/${payload.fileName}`]);
        if (storageError) console.error("Storage delete error:", storageError);

        const { error: dbError } = await supabase
          .from("notes")
          .delete()
          .eq("id", payload.noteId);
        if (dbError) throw dbError;
        await logAction(supabase, manager.id, manager.email, "delete_note", { noteId: payload.noteId, fileName: payload.fileName });
        result = { success: true };
        break;
      }

      case "update_note": {
        const { error } = await supabase
          .from("notes")
          .update(payload.updates)
          .eq("id", payload.noteId);
        if (error) throw error;
        await logAction(supabase, manager.id, manager.email, "update_note", { noteId: payload.noteId, updates: payload.updates });
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
        await logAction(supabase, manager.id, manager.email, "insert_subject", { subjectName: payload.subject?.name });
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
        const { data, error } = await supabase.rpc("generate_unique_subject_code", {
          p_program_id: payload.programId,
          p_base_code: payload.baseCode || "CUSTOM",
        });
        if (error) throw error;
        result = { code: data };
        break;
      }

      // ── Manager operations (admin only) ──
      case "add_manager": {
        if (manager.role !== "admin") {
          return new Response(JSON.stringify({ error: "Only admins can add managers" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: existing } = await supabase
          .from("managers")
          .select("id")
          .eq("email", payload.managerEmail)
          .maybeSingle();

        if (existing) {
          return new Response(JSON.stringify({ error: "A manager with this email already exists" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Hash password using pgcrypto via RPC
        const { data: newManager, error } = await supabase.rpc("create_manager", {
          p_email: payload.managerEmail,
          p_name: payload.managerName,
          p_password: payload.managerPassword,
          p_role: payload.managerRole || "manager",
          p_created_by: manager.id,
        });

        if (error) throw error;
        await logAction(supabase, manager.id, manager.email, "add_manager", { newManagerEmail: payload.managerEmail, role: payload.managerRole });
        result = newManager;
        break;
      }

      case "list_managers": {
        if (manager.role !== "admin") {
          return new Response(JSON.stringify({ error: "Only admins can list managers" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data, error } = await supabase
          .from("managers")
          .select("id, email, name, role, is_active, created_at")
          .order("created_at", { ascending: true });
        if (error) throw error;
        result = data;
        break;
      }

      case "toggle_manager": {
        if (manager.role !== "admin") {
          return new Response(JSON.stringify({ error: "Only admins can modify managers" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Prevent deactivating yourself
        if (payload.managerId === manager.id) {
          return new Response(JSON.stringify({ error: "Cannot deactivate yourself" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await supabase
          .from("managers")
          .update({ is_active: payload.isActive })
          .eq("id", payload.managerId);
        if (error) throw error;
        await logAction(supabase, manager.id, manager.email, "toggle_manager", { managerId: payload.managerId, isActive: payload.isActive });
        result = { success: true };
        break;
      }

      case "delete_manager": {
        if (manager.role !== "admin") {
          return new Response(JSON.stringify({ error: "Only admins can delete managers" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (payload.managerId === manager.id) {
          return new Response(JSON.stringify({ error: "Cannot delete yourself" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await supabase
          .from("managers")
          .delete()
          .eq("id", payload.managerId);
        if (error) throw error;
        await logAction(supabase, manager.id, manager.email, "delete_manager", { managerId: payload.managerId });
        result = { success: true };
        break;
      }

      // ── Audit log operations (admin only) ──
      case "get_audit_logs": {
        if (manager.role !== "admin") {
          return new Response(JSON.stringify({ error: "Only admins can view audit logs" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        result = data;
        break;
      }

      // ── Auth check (returns manager info) ──
      case "verify_login": {
        await logAction(supabase, manager.id, manager.email, "login", {});
        result = { id: manager.id, email: manager.email, name: manager.name, role: manager.role };
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
