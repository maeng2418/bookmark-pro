import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/lib/categories";

export class CategoryService {
  static async fetchCategories(userId: string): Promise<Category[]> {
    try {
      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("category, category_color")
        .eq("user_id", userId);

      if (!bookmarks) return [];

      // Extract unique categories with their colors
      const categoryMap = new Map<string, string>();
      
      bookmarks.forEach(bookmark => {
        if (bookmark.category && !categoryMap.has(bookmark.category)) {
          categoryMap.set(bookmark.category, bookmark.category_color || "#6B7280");
        }
      });

      return Array.from(categoryMap.entries()).map(([name, color], index) => ({
        id: `category-${index}`,
        name,
        color,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("카테고리를 불러오는데 실패했습니다.");
    }
  }

  static async getCategoryColor(categoryName: string, userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from("bookmarks")
        .select("category_color")
        .eq("user_id", userId)
        .eq("category", categoryName)
        .limit(1);

      return data?.[0]?.category_color || "#6B7280";
    } catch (error) {
      console.error("Error fetching category color:", error);
      return "#6B7280"; // Default color
    }
  }
}