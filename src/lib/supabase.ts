
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Get Supabase URL and key from environment variables, with default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if URL and key are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || 'http://your-supabase-url.com',
  supabaseAnonKey || 'your-anon-key'
);

