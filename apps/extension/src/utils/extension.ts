// Chrome Extension API utilities
import type { Bookmark, CreateBookmarkData } from '@bookmark-pro/ui'

export const isChromeExtension = (() => {
  try {
    return (
      typeof chrome !== 'undefined' &&
      typeof chrome.runtime !== 'undefined' &&
      chrome.runtime.id !== undefined
    )
  } catch {
    return false
  }
})()

export const runWithBrowser = async <T>(
  extensionCallback: () => Promise<T> | T,
  browserCallback?: () => T,
): Promise<T> => {
  try {
    if (!isChromeExtension) {
      if (!browserCallback) {
        throw new Error('Browser callback is required in non-extension environment')
      }
      return browserCallback()
    }

    return await extensionCallback()
  } catch (error) {
    console.error('Environment detection or execution failed:', error)
    throw error
  }
}

export const getCurrentTab = async () => {
  let currentTab: chrome.tabs.Tab | { url: string; title: string } | null = null

  await runWithBrowser(
    async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (!tab) {
        throw new Error('No active tab found')
      }
      currentTab = tab
    },
    () => {
      currentTab = {
        url: window.location.href,
        title: document.title,
      }
    },
  )

  if (!currentTab) {
    throw new Error('No active tab found')
  }
  return currentTab
}

export const saveBookmark = async (bookmarkData: CreateBookmarkData, userId?: string) => {
  const bookmarks = await getStoredBookmarks()
  const newBookmark = {
    id: crypto.randomUUID(),
    ...bookmarkData,
    userId,
    createdAt: new Date().toISOString(),
  }

  bookmarks.push(newBookmark)

  await runWithBrowser(
    async () => {
      await chrome.storage.local.set({ bookmarks })
    },
    () => {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    },
  )

  // TODO: Supabase 저장 로직 추가 예정
  console.log('Bookmark saved:', newBookmark)
}

export const getStoredBookmarks = async (): Promise<Bookmark[]> => {
  let bookmarks: Bookmark[] = []

  bookmarks = await runWithBrowser(
    async () => {
      const result = await chrome.storage.local.get(['bookmarks'])
      return result.bookmarks || []
    },
    () => {
      const stored = localStorage.getItem('bookmarks')
      try {
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Failed to parse stored bookmarks:', error)
        return []
      }
    },
  )

  return bookmarks
}

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL || 'http://localhost:8080'

export const openWebApp = async () => {
  await runWithBrowser(
    async () => {
      chrome.tabs.create({ url: WEB_APP_URL })
    },
    () => {
      window.open(WEB_APP_URL, '_blank')
    },
  )
}
