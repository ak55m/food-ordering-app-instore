
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase';

// Check if Supabase is properly configured before rendering
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not set. Some features may not work correctly.');
}

createRoot(document.getElementById("root")!).render(<App />);
