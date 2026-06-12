import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Saknar VITE_SUPABASE_URL eller VITE_SUPABASE_ANON_KEY i miljövariablerna.')
}

export const supabase = createClient(url, key)
