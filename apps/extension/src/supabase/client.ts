import { runWithBrowser } from '@/utils/extension'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!

// Cross-environment storage using runWithBrowser
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: {
      getItem: async (key) => {
        return await runWithBrowser(
          async () => {
            const storageResult = await chrome.storage.local.get([key])
            return storageResult[key] || null
          },
          () => {
            return localStorage.getItem(key)
          },
        )
      },
      setItem: async (key, value) => {
        return await runWithBrowser(
          async () => {
            await chrome.storage.local.set({ [key]: value })
          },
          () => {
            localStorage.setItem(key, value)
          },
        )
      },
      removeItem: async (key) => {
        return await runWithBrowser(
          async () => {
            await chrome.storage.local.remove([key])
          },
          () => {
            localStorage.removeItem(key)
          },
        )
      },
    },
    persistSession: true,
    autoRefreshToken: true,
  },
})
