
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Supabase URL and key - hardcoded for this project
const supabaseUrl = 'https://jurgzlaiespprlrwkpxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cmd6bGFpZXNwcHJscndrcHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODU1NTQsImV4cCI6MjA1OTA2MTU1NH0.uLozsONSMn3wEtGlvw2yT2UBlmm7_0Qq81sg4c13ulc';

// Extend the SupabaseClient type to include our custom methods
interface ExtendedSupabaseClient extends SupabaseClient<Database, "public", any> {
  rpc<T = any>(procedureName: string, params?: object): Promise<{
    data: T;
    error: null;
  } | {
    data: null;
    error: Error;
  }>;
}

// Initialize the Supabase client
const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Export the typed client
export const supabase = supabaseClient as ExtendedSupabaseClient;
