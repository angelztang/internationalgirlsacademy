import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  const errorMessage =
    'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
  // Warn during build rather than throwing so Next.js can finish building other pages.
  // Accessing any Supabase APIs at runtime will throw a helpful error.
  console.warn(errorMessage)

  // Proxy that throws when any property is accessed or called.
  const thrower = () => {
    throw new Error(errorMessage)
  }

  supabase = new Proxy({}, {
    get: () => thrower,
    apply: () => { thrower() }
  })
}

export { supabase }

// Helper to get current user (safe: returns null if Supabase not configured)
export const getCurrentUser = async () => {
  try {
    if (!supabase) return null
    const res = await supabase.auth.getUser()
    return res?.data?.user ?? null
  } catch (e) {
    console.warn('getCurrentUser: supabase not configured or request failed')
    return null
  }
}

// Helper to get session (safe)
export const getSession = async () => {
  try {
    if (!supabase) return null
    const res = await supabase.auth.getSession()
    return res?.data?.session ?? null
  } catch (e) {
    console.warn('getSession: supabase not configured or request failed')
    return null
  }
}
