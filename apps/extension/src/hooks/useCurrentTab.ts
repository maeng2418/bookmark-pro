import { useEffect, useState } from "react";
import { getCurrentTab } from "@/lib/extension";
import type { BookmarkType } from "@/types";

interface UseCurrentTabReturn {
  currentTab: chrome.tabs.Tab | null;
  isCurrentUrlSaved: boolean;
  currentBookmark: BookmarkType | undefined;
  loading: boolean;
}

export function useCurrentTab(bookmarks: BookmarkType[]): UseCurrentTabReturn {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentTab = async () => {
      try {
        const tab = await getCurrentTab();
        setCurrentTab(tab);
      } catch (error) {
        console.error("Failed to get current tab:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentTab();
  }, []);

  const currentBookmark = currentTab?.url 
    ? bookmarks.find(bookmark => bookmark.url === currentTab.url)
    : undefined;

  const isCurrentUrlSaved = !!currentBookmark;

  return {
    currentTab,
    isCurrentUrlSaved,
    currentBookmark,
    loading,
  };
}