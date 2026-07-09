import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env and set ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Project Settings → API in the Supabase ' +
      'dashboard), then run supabase/schema.sql in the SQL Editor if you haven’t already.',
  )
}

// Every repository queries through this client — there is no mock-data fallback.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
