import BookmarkList from "@/components/BookmarkList";
import { Button } from "@bookmark-pro/ui";
import {
  Bookmark,
  Globe,
  LogOut,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { supabase } from "../integrations/supabase/client";
import { getCurrentTab } from "../lib/extension";

export interface BookmarkType {
  category: string;
  created_at: string;
  description: string | null;
  favicon: string | null;
  id: string;
  tags: string[] | null;
  title: string;
  updated_at: string;
  url: string;
  user_id: string;
}

export default function MainPage() {
  const { user, loading: authLoading } = useAuthGuard(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUrl = "" } = location.state || {};

  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setBookmarks(data);
        const uniqueCategories = [
          ...new Set(data.map((b) => b.category).filter(Boolean) as string[]),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const tab = await getCurrentTab();
        setCurrentTab(tab);
      } catch (error) {
        console.error("Failed to get current tab:", error);
      }
    };

    loadInitialData();
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (currentTab?.url && bookmarks.length > 0) {
      const isSaved = bookmarks.some(
        (bookmark) => bookmark.url === currentTab.url
      );
      setIsUrlSaved(isSaved);
    } else {
      setIsUrlSaved(false);
    }
  }, [currentTab, bookmarks]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleAddBookmark = () => {
    if (currentTab) {
      navigate("/bookmark-form", {
        state: {
          currentUrl: currentTab.url || "",
          currentTitle: currentTab.title || "",
        },
      });
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ id, user_id: user.id });

      if (error) {
        throw error;
      }

      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const handleDeleteCurrentBookmark = async () => {
    if (!currentTab?.url) return;
    const bookmarkToDelete = bookmarks.find((b) => b.url === currentTab.url);
    if (bookmarkToDelete) {
      await handleDeleteBookmark(bookmarkToDelete.id);
    }
  };

  if (authLoading || (loading && bookmarks.length === 0)) {
    return (
      <div className="flex items-center justify-center bg-white w-80 h-96">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
              <Bookmark fill="currentColor" className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">BookmarkPro</h1>
          </div>
          <div className="flex items-center space-x-2">
            {user && <UserProfile user={user} size="sm" />}
            <button
              onClick={handleSignOut}
              className="p-1 text-gray-500 rounded hover:text-gray-700"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              전체 북마크
            </h2>
            <p className="text-sm text-gray-500">({bookmarks.length}개)</p>
          </div>
          <Button
            onClick={handleAddBookmark}
            size="sm"
            className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1 !rounded-button"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </Button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center mb-3 space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Globe width={14} height={14} className="text-blue-600 " />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  현재 페이지
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {currentUrl || window.location.href || "URL을 불러오는 중..."}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isUrlSaved ? (
                <>
                  <Button
                    onClick={handleDeleteCurrentBookmark}
                    variant="destructive"
                    size="sm"
                    className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center !rounded-button"
                  >
                    <Trash2 width={12} height={12} />
                    <span>삭제</span>
                  </Button>
                  <Button
                    onClick={handleAddBookmark}
                    size="sm"
                    className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-sm !rounded-button"
                  >
                    <PencilLine width={12} height={12} />
                    <span>수정</span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAddBookmark}
                  size="sm"
                  className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center !rounded-button"
                >
                  <Bookmark width={14} height={14} />
                  <span>북마크</span>
                </Button>
              )}
            </div>
          </div>

          <BookmarkList
            bookmarks={bookmarks}
            categories={categories}
            onDelete={handleDeleteBookmark}
          />
        </div>
      </div>
    </div>
  );
}
