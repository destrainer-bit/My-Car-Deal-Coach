import { createClient } from '@supabase/supabase-js';

export const supabaseServer = createClient(
  process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key', // server-only
  { auth: { persistSession: false, autoRefreshToken: false } }
);


