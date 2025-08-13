import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { fetchCategories, Category } from "@/lib/categories";
import { useToast } from "@/contexts/ToastContext";
import type { BookmarkType } from "@/types";

interface UseBookmarksReturn {
  bookmarks: BookmarkType[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteBookmark: (id: string) => Promise<boolean>;
}

export function useBookmarks(user: User | null): UseBookmarksReturn {
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
        supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        fetchCategories(user.id),
      ]);

      if (bookmarksData.error) {
        throw bookmarksData.error;
      }

      setBookmarks(bookmarksData.data || []);
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

  const deleteBookmark = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ id, user_id: user.id });

      if (error) throw error;

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
      showSuccess("북마크가 삭제되었습니다.");
      return true;
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      const errorMessage = "북마크 삭제에 실패했습니다.";
      setError(errorMessage);
      showError(errorMessage);
      return false;
    }
  }, [user]);

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
  };
}