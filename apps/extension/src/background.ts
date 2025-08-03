// Background script for BookmarkPro extension

console.log("BookmarkPro background script loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("BookmarkPro extension installed");
    // 초기 설정이나 환영 페이지 열기 등
  }
});

// Handle browser action click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked", tab);
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);

  switch (request.action || request.type) {
    case "saveBookmark":
      // 북마크 저장 로직
      handleSaveBookmark(request.data)
        .then((result) => sendResponse({ success: true, data: result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true; // 비동기 응답을 위해 true 반환

    case "OAUTH_SUCCESS":
      // OAuth 성공 시 토큰 저장
      console.log("OAuth success received:", request.tokens);
      handleOAuthSuccess(request.tokens)
        .then((result) => sendResponse({ success: true, data: result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "OAUTH_ERROR":
      // OAuth 에러 처리
      console.error("OAuth Error:", request.error);
      sendResponse({ success: false, error: request.error });
      break;

    default:
      sendResponse({ success: false, error: "Unknown action" });
  }
});

interface BookmarkData {
  title: string;
  url: string;
  category: string;
  tags: string[];
}

interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

async function handleSaveBookmark(bookmarkData: BookmarkData) {
  // 북마크 저장 처리
  const bookmarks = await chrome.storage.local.get(["bookmarks"]);
  const currentBookmarks = bookmarks.bookmarks || [];

  const newBookmark = {
    id: Date.now().toString(),
    ...bookmarkData,
    createdAt: new Date().toISOString(),
  };

  currentBookmarks.push(newBookmark);
  await chrome.storage.local.set({ bookmarks: currentBookmarks });

  return newBookmark;
}

async function handleOAuthSuccess(tokens: OAuthTokens) {
  try {
    console.log("Processing OAuth tokens...");

    // Supabase 세션 형태로 변환
    const session = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
      token_type: tokens.token_type,
      user: null, // 사용자 정보는 나중에 Supabase에서 가져옴
    };

    // Chrome storage에 세션 저장 (Supabase auth storage key 사용)
    const storageKey = `supabase.auth.token`;
    await chrome.storage.local.set({ [storageKey]: JSON.stringify(session) });

    console.log("OAuth tokens saved successfully");

    // 모든 확장프로그램 창/탭에 인증 상태 변경 알림
    chrome.runtime
      .sendMessage({
        type: "AUTH_STATE_CHANGED",
        session: session,
      })
      .catch(() => {
        // 메시지를 받을 대상이 없을 수 있음 (정상)
        console.log("No listeners for auth state change message");
      });

    return { success: true };
  } catch (error) {
    console.error("Failed to save OAuth tokens:", error);
    throw error;
  }
}
