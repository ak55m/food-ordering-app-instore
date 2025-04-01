
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Supabase URL and key - hardcoded for this project
export const supabaseUrl = 'https://jurgzlaiespprlrwkpxk.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cmd6bGFpZXNwcHJscndrcHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODU1NTQsImV4cCI6MjA1OTA2MTU1NH0.uLozsONSMn3wEtGlvw2yT2UBlmm7_0Qq81sg4c13ulc';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
