console.log("OAuth callback script loaded");
console.log("Current URL:", window.location.href);

// URL fragment에서 OAuth 토큰 추출
const fragment = window.location.hash.substring(1);
const params = new URLSearchParams(fragment);

const accessToken = params.get("access_token");
const refreshToken = params.get("refresh_token");
const expiresIn = params.get("expires_in");
const tokenType = params.get("token_type");

console.log("Extracted tokens:", {
  accessToken: !!accessToken,
  refreshToken: !!refreshToken,
  expiresIn,
  tokenType,
});

if (accessToken && refreshToken) {
  console.log("Tokens found, sending message to extension...");

  // Chrome extension의 background script나 popup으로 토큰 전달
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage(
      {
        type: "OAUTH_SUCCESS",
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: parseInt(expiresIn) || 3600,
          token_type: tokenType || "bearer",
        },
      },
      (response) => {
        console.log("OAuth tokens sent to extension:", response);
        // 창 닫기
        setTimeout(() => {
          console.log("Closing OAuth callback window");
          window.close();
        }, 500);
      }
    );
  } else {
    console.error("Chrome runtime not available");
    // 창 닫기
    setTimeout(() => {
      window.close();
    }, 1000);
  }
} else {
  console.error("No tokens found in URL");
  console.error("Full URL:", window.location.href);

  // 에러 메시지 전달
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage(
      {
        type: "OAUTH_ERROR",
        error: "No tokens found in callback URL",
      },
      (response) => {
        console.log("OAuth error sent to extension:", response);
        // 창 닫기
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    );
  } else {
    // 창 닫기
    setTimeout(() => {
      window.close();
    }, 1000);
  }
}
