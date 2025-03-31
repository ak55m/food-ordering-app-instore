
// This file is kept for compatibility with existing code
// But we're not actually using Supabase anymore

export const supabase = {
  // Mock Supabase client methods (not used but kept for structure)
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  }),
};
