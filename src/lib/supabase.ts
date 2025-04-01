
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Supabase URL and key - hardcoded for this project
const supabaseUrl = 'https://jurgzlaiespprlrwkpxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cmd6bGFpZXNwcHJscndrcHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODU1NTQsImV4cCI6MjA1OTA2MTU1NH0.uLozsONSMn3wEtGlvw2yT2UBlmm7_0Qq81sg4c13ulc';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Add direct SQL query method
supabase.query = async (sql: string, params?: any[]) => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql,
        params: params || []
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData };
    }
    
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
