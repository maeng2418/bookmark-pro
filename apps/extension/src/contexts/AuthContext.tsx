import { AuthError, Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { isChromeExtension } from "../lib/extension";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signInWithGoogle: () => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Chrome extension에서 background script의 인증 상태 변경 메시지 수신
    let messageHandlerAdded = false;
    if (isChromeExtension) {
      const handleMessage = (message: any) => {
        if (!isMounted) return;
        
        if (message.type === "AUTH_STATE_CHANGED") {
          console.log("Auth state changed message received:", message);
          // background script에서 세션 정보를 받아 Supabase에 설정
          if (message.session) {
            supabase.auth.setSession({
              access_token: message.session.access_token,
              refresh_token: message.session.refresh_token,
            });
          }
        }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      messageHandlerAdded = true;

      return () => {
        isMounted = false;
        subscription.unsubscribe();
        if (messageHandlerAdded) {
          chrome.runtime.onMessage.removeListener(handleMessage);
        }
      };
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error || undefined };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error: error || undefined };
  };

  const signInWithGoogle = async () => {
    if (isChromeExtension) {
      try {
        console.log("Starting Google OAuth for Chrome extension...");
        console.log("Extension ID:", chrome.runtime.id);

        // Chrome identity API 권한 확인
        if (!chrome.identity) {
          return {
            error: new Error(
              "Chrome identity API를 사용할 수 없습니다."
            ) as AuthError,
          };
        }

        // Chrome extension OAuth 콜백 페이지 사용
        const callbackUrl = `chrome-extension://${chrome.runtime.id}/src/oauth-callback.html`;
        console.log("Using callback URL:", callbackUrl);

        // Supabase OAuth URL 생성
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          console.error("Supabase OAuth URL 생성 오류:", error);
          return { error };
        }

        if (!data?.url) {
          return {
            error: new Error("OAuth URL을 생성할 수 없습니다.") as AuthError,
          };
        }

        console.log("OAuth URL 생성됨:", data.url);

        // Chrome Identity API를 사용한 웹 인증 플로우
        return new Promise<{ error?: AuthError }>((resolve) => {
          let authCompleted = false;

          // background script의 AUTH_STATE_CHANGED 메시지를 기다림
          const handleAuthMessage = (message: any) => {
            if (authCompleted) return;

            if (message.type === "AUTH_STATE_CHANGED") {
              console.log(
                "OAuth completed successfully via background message"
              );
              authCompleted = true;
              chrome.runtime.onMessage.removeListener(handleAuthMessage);
              resolve({ error: undefined });
            }
          };

          chrome.runtime.onMessage.addListener(handleAuthMessage);

          console.log("Launching OAuth flow...");
          chrome.identity.launchWebAuthFlow(
            {
              url: data.url,
              interactive: true,
            },
            (resultUrl) => {
              console.log(
                "launchWebAuthFlow completed, result URL:",
                resultUrl
              );

              // Chrome runtime 오류가 있어도 background script 메시지를 기다림
              if (chrome.runtime.lastError) {
                console.log(
                  "Chrome runtime error (expected):",
                  chrome.runtime.lastError.message
                );
                // 에러가 있어도 바로 실패 처리하지 않고 background script 메시지를 기다림
                console.log(
                  "Ignoring Chrome runtime error, waiting for background message..."
                );
              }

              // resultUrl이 undefined여도 oauth-callback.js가 실행되었을 수 있으므로 기다림
              if (!resultUrl) {
                console.log(
                  "No result URL, but waiting for background script message..."
                );
              }

              // oauth-callback.js가 토큰을 처리하고 background script에 전달할 것임
              console.log("Waiting for background script to process tokens...");
            }
          );

          // 타임아웃 설정 (45초로 늘림)
          setTimeout(() => {
            if (!authCompleted) {
              console.log("OAuth timeout - no background message received");
              chrome.runtime.onMessage.removeListener(handleAuthMessage);
              resolve({
                error: new Error(
                  "OAuth 타임아웃 - 인증 메시지를 받지 못했습니다."
                ) as AuthError,
              });
            }
          }, 45000);
        });
      } catch (error: any) {
        console.error("signInWithGoogle 전체 오류:", error);
        return { error: error as AuthError };
      }
    } else {
      // 웹 환경: 기존 방식 유지
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      return { error: error || undefined };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
