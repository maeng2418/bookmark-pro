// Chrome Extension API utilities

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) {
    throw new Error('No active tab found')
  }
  return tab
}

export async function saveBookmark(bookmarkData: {
  url: string
  title: string
  tags: string[]
  memo?: string
}) {
  // 로컬 스토리지에 임시 저장 (나중에 웹 앱과 연동)
  const bookmarks = await getStoredBookmarks()
  const newBookmark = {
    id: Date.now().toString(),
    ...bookmarkData,
    createdAt: new Date().toISOString(),
  }
  
  bookmarks.push(newBookmark)
  await chrome.storage.local.set({ bookmarks })
  
  // TODO: 웹 앱의 Supabase와 동기화
  console.log('Bookmark saved:', newBookmark)
}

export async function getStoredBookmarks() {
  const result = await chrome.storage.local.get(['bookmarks'])
  return result.bookmarks || []
}

export function openWebApp() {
  chrome.tabs.create({ url: 'http://localhost:8080' })
}