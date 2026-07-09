import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Copy .env.example to .env and fill in VITE_SUPABASE_URL / ' +
      'VITE_SUPABASE_ANON_KEY (see supabase/schema.sql for the database setup). Until then, ' +
      'repositories keep using their in-memory mock data.',
  )
}

// Repositories don't consume this client yet — that migration happens repository-by-repository,
// each replacing its TODO(supabase) comments with real supabase.from(...) calls.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
