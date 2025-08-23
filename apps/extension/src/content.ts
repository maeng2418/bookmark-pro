// Content script for BookmarkPro extension

console.log('BookmarkPro content script loaded on:', window.location.href)

// 페이지 정보 수집
const pageInfo = {
  url: window.location.href,
  title: document.title,
  description: getMetaDescription(),
  favicon: getFaviconUrl(),
}

function getMetaDescription(): string {
  const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement
  return metaDescription ? metaDescription.content : ''
}

function getFaviconUrl(): string {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (favicon) {
    return favicon.href
  }

  const shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement
  if (shortcutIcon) {
    return shortcutIcon.href
  }

  // 기본 favicon 경로
  return `${window.location.origin}/favicon.ico`
}

// 키보드 단축키 처리 (Ctrl+Shift+B)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'B') {
    event.preventDefault()
    openBookmarkDialog()
  }
})

function openBookmarkDialog() {
  // 팝업 열기 메시지를 background script에 전송
  chrome.runtime.sendMessage({
    action: 'openPopup',
    data: pageInfo,
  })
}

// 우클릭 컨텍스트 메뉴 처리를 위한 페이지 정보 저장
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse(pageInfo)
  }
})
