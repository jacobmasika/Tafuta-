import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies()
  // If Supabase env vars aren't set (local dev), return a stub client
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const dummyQuery: any = {
      select() {
        return this
      },
      eq() {
        return this
      },
      order() {
        return this
      },
      or() {
        return this
      },
      gte() {
        return this
      },
      lte() {
        return this
      },
      then(resolve: any) {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      },
      catch() {
        return this
      },
    }

    return {
      from() {
        return dummyQuery
      },
      // minimal auth stub used sparingly in some places
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as any
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
