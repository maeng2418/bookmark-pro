import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oqhpciikypyiophscfzu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xaHBjaWlreXB5aW9waHNjZnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzYyNzUsImV4cCI6MjA2OTExMjI3NX0.DrELJDKAwMDjlZM2rx29xVFAXPzylWL62kd6Vl2A8cQ";

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