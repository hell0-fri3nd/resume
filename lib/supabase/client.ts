import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in Client Components and browser-side code.
 * Reads the public env vars, so it is safe to bundle — the anon key is guarded
 * by Row Level Security on the server.
 *
 * Create a fresh client per call rather than a module-level singleton so it
 * always picks up the current cookies/session in the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
