
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
// For a real app, these would be in environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
