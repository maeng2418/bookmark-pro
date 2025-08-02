import { supabase } from "../integrations/supabase/client";

export interface Category {
  id?: string;
  name: string;
  color: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveCategory(
  categoryData: Omit<Category, "id" | "created_at" | "updated_at" | "user_id">,
  userId: string
): Promise<{ success: boolean; error?: string; data?: Category }> {
  try {
    // Add new category
    const { data, error } = await supabase
      .from("categories")
      .insert({
        ...categoryData,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (duplicate category name)
      if (error.code === '23505') {
        return {
          success: false,
          error: "이미 존재하는 카테고리명입니다.",
        };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error saving category:", error);
    return {
      success: false,
      error: "카테고리 저장에 실패했습니다.",
    };
  }
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: "카테고리 삭제에 실패했습니다.",
    };
  }
}