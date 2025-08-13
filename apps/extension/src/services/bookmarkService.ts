import { supabase } from "@/integrations/supabase/client";
import type { BookmarkType, BookmarkCreateData, BookmarkUpdateData, BookmarkApiResponse } from "@/types";

export class BookmarkService {
  static async fetchBookmarks(userId: string): Promise<BookmarkType[]> {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      throw new Error("북마크를 불러오는데 실패했습니다.");
    }
  }

  static async createBookmark(
    bookmarkData: BookmarkCreateData,
    userId: string
  ): Promise<BookmarkApiResponse> {
    try {
      // Check for duplicate URL
      const { data: existingBookmarks } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("url", bookmarkData.url);

      if (existingBookmarks && existingBookmarks.length > 0) {
        return {
          success: false,
          error: "이미 저장된 URL입니다.",
        };
      }

      // Add new bookmark
      const { categoryColor, ...bookmarkToSave } = bookmarkData;
      const { error } = await supabase.from("bookmarks").insert({
        ...bookmarkToSave,
        category_color: categoryColor,
        user_id: userId,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error saving bookmark:", error);
      return {
        success: false,
        error: "북마크 저장에 실패했습니다.",
      };
    }
  }

  static async updateBookmark(
    bookmarkId: string,
    updates: BookmarkUpdateData
  ): Promise<BookmarkApiResponse> {
    try {
      // Check for duplicate URL except current bookmark
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", updates.userId)
        .eq("url", updates.url)
        .neq("id", bookmarkId);

      if (existing && existing.length > 0) {
        return { success: false, error: "이미 저장된 URL입니다." };
      }

      const { error } = await supabase
        .from("bookmarks")
        .update({
          title: updates.title,
          url: updates.url,
          description: updates.description ?? null,
          category: updates.category,
          category_color: updates.categoryColor,
          tags: updates.tags,
        })
        .eq("id", bookmarkId)
        .eq("user_id", updates.userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error updating bookmark:", error);
      return { success: false, error: "북마크 수정에 실패했습니다." };
    }
  }

  static async deleteBookmark(
    bookmarkId: string,
    userId: string
  ): Promise<BookmarkApiResponse> {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ id: bookmarkId, user_id: userId });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      return {
        success: false,
        error: "북마크 삭제에 실패했습니다.",
      };
    }
  }

  static async checkUrlExists(url: string, userId: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("url", url);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data } = await query;
      return !!(data && data.length > 0);
    } catch (error) {
      console.error("Error checking URL existence:", error);
      return false;
    }
  }
}