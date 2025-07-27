import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

// Extension environment에서는 chrome.storage를 사용
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: {
      getItem: async (key) => {
        const result = await chrome.storage.local.get([key]);
        return result[key] || null;
      },
      setItem: async (key, value) => {
        await chrome.storage.local.set({ [key]: value });
      },
      removeItem: async (key) => {
        await chrome.storage.local.remove([key]);
      },
    },
    persistSession: true,
    autoRefreshToken: true,
  }
});