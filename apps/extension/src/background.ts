// Background script for BookmarkPro extension

console.log('BookmarkPro background script loaded')

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('BookmarkPro extension installed')
    // 초기 설정이나 환영 페이지 열기 등
  }
})

// Handle browser action click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked', tab)
})

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request)
  
  switch (request.action) {
    case 'saveBookmark':
      // 북마크 저장 로직
      handleSaveBookmark(request.data)
        .then((result) => sendResponse({ success: true, data: result }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      return true // 비동기 응답을 위해 true 반환
      
    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
})

interface BookmarkData {
  title: string;
  url: string;
  category: string;
  tags: string[];
}

async function handleSaveBookmark(bookmarkData: BookmarkData) {
  // 북마크 저장 처리
  const bookmarks = await chrome.storage.local.get(['bookmarks'])
  const currentBookmarks = bookmarks.bookmarks || []
  
  const newBookmark = {
    id: Date.now().toString(),
    ...bookmarkData,
    createdAt: new Date().toISOString(),
  }
  
  currentBookmarks.push(newBookmark)
  await chrome.storage.local.set({ bookmarks: currentBookmarks })
  
  return newBookmark
}