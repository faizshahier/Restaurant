import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Newer Supabase projects issue a "publishable" key (sb_publishable_…) in place of the
// legacy anon JWT. Both are safe to ship in browser code and both work here, so accept
// either name rather than forcing existing setups to rename their variable.
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY (or the legacy VITE_SUPABASE_ANON_KEY) in .env — both are ' +
      'shown under Project Settings → API in the Supabase dashboard. Then run ' +
      'supabase/schema.sql in the SQL Editor if you haven’t already.',
  )
}

// Every repository queries through this client — there is no mock-data fallback.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
