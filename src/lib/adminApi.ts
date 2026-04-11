import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface AdminApiPayload {
  action: string;
  adminEmail: string;
  adminPassword: string;
  [key: string]: unknown;
}

export async function callAdminApi(payload: AdminApiPayload) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Admin API request failed');
  }
  
  return result.data;
}
