import { useToast } from "@/contexts/ToastContext";
import { BookmarkService, CategoryService } from "@/services";
import type { Category } from "@/supabase/categories";
import type { BookmarkType } from "@/types";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

type UseBookmarksReturn = {
  bookmarks: BookmarkType[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteBookmark: (id: string) => Promise<boolean>;
  searchBookmarks: (query: string, categoryId?: string) => Promise<BookmarkType[]>;
  searchBookmarksByTags: (tags: string[]) => Promise<BookmarkType[]>;
};

export const useBookmarks = (user: User | null): UseBookmarksReturn => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  const fetchData = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [bookmarksData, categoriesData] = await Promise.all([
        BookmarkService.fetchBookmarks(user.id),
        CategoryService.fetchCategories(user.id),
      ]);

      setBookmarks(bookmarksData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      const errorMessage = "북마크를 불러오는데 실패했습니다.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteBookmark = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const result = await BookmarkService.deleteBookmark(id);

        if (result.success) {
          setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
          showSuccess("북마크가 삭제되었습니다.");
          return true;
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("Error deleting bookmark:", err);
        const errorMessage =
          err instanceof Error ? err.message : "북마크 삭제에 실패했습니다.";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      }
    },
    [user, showError, showSuccess]
  );

  const searchBookmarks = useCallback(
    async (query: string, categoryId?: string): Promise<BookmarkType[]> => {
      if (!user) return [];

      try {
        return await BookmarkService.searchBookmarks(user.id, query, categoryId);
      } catch (err) {
        console.error("Error searching bookmarks:", err);
        const errorMessage = "북마크 검색에 실패했습니다.";
        setError(errorMessage);
        showError(errorMessage);
        return [];
      }
    },
    [user, showError]
  );

  const searchBookmarksByTags = useCallback(
    async (tags: string[]): Promise<BookmarkType[]> => {
      if (!user) return [];

      try {
        return await BookmarkService.searchBookmarksByTags(user.id, tags);
      } catch (err) {
        console.error("Error searching bookmarks by tags:", err);
        const errorMessage = "태그 검색에 실패했습니다.";
        setError(errorMessage);
        showError(errorMessage);
        return [];
      }
    },
    [user, showError]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    bookmarks,
    categories,
    loading,
    error,
    refetch: fetchData,
    deleteBookmark,
    searchBookmarks,
    searchBookmarksByTags,
  };
};
