import { supabase } from "@/integrations/supabase/client";
import type { BookmarkType, BookmarkCreateData, BookmarkUpdateData, BookmarkApiResponse } from "@/types";

export async function saveBookmark(
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

export async function fetchBookmarks(userId: string): Promise<BookmarkType[]> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const normalized: BookmarkType[] = (data || []).map(
      (row: {
        id: string;
        title: string;
        url: string;
        description: string | null;
        category: string;
        category_color: string | null;
        tags: string[] | null;
        favicon: string | null;
        user_id: string;
        created_at: string;
      }) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description ?? undefined,
        category: row.category,
        categoryColor: row.category_color ?? undefined,
        tags: row.tags ?? [],
        favicon: row.favicon ?? undefined,
        user_id: row.user_id,
        created_at: row.created_at,
      })
    );
    return normalized;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function deleteBookmark(
  bookmarkId: string
): Promise<BookmarkApiResponse> {
  try {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);

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

export async function updateBookmark(
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
