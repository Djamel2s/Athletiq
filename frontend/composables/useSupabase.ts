import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (client) return client;

  const config = useRuntimeConfig();
  const url = config.public.supabaseUrl;
  const anonKey = config.public.supabaseAnonKey;

  if (!url || !anonKey) {
    throw new Error('Supabase URL or anon key is not configured in runtime config');
  }

  client = createClient(url, anonKey);
  return client;
};

export default getSupabase;
