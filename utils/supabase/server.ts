import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// For SSR/page loaders: safe read-only client (uses anon key)
export function createAnonServerClient(): SupabaseClient {
return createClient(url, anon, {
auth: { persistSession: false },
});
}

// For API routes/admin writes: privileged client (service role; DO NOT use in browser)
export function createServiceServerClient(): SupabaseClient {
return createClient(url, service, {
auth: { persistSession: false },
});
}

