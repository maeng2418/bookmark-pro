import { supabase } from "@/integrations/supabase/client";

export interface Bookmark {
  id?: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  tags: string[];
  favicon?: string;
  user_id?: string;
  created_at?: string;
}

export async function saveBookmark(
  bookmarkData: Omit<Bookmark, "id" | "created_at" | "user_id">,
  userId: string
): Promise<{ success: boolean; error?: string }> {
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
    const { error } = await supabase.from("bookmarks").insert({
      ...bookmarkData,
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

export async function fetchBookmarks(userId: string): Promise<Bookmark[]> {
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
    return [];
  }
}

export async function deleteBookmark(
  bookmarkId: string
): Promise<{ success: boolean; error?: string }> {
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
