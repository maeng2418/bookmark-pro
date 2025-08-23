import {
  fetchCategories,
  saveCategory,
  deleteCategory,
  checkCategoryInUse,
  type Category,
} from '@/supabase/categories'

export class CategoryService {
  static async fetchCategories(userId: string): Promise<Category[]> {
    return fetchCategories(userId)
  }

  static async createCategory(
    categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
    userId: string,
  ): Promise<{ success: boolean; error?: string; data?: Category }> {
    return saveCategory(categoryData, userId)
  }

  static async deleteCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
    return deleteCategory(categoryId)
  }

  static async checkCategoryInUse(categoryId: string): Promise<{ inUse: boolean; count: number }> {
    return checkCategoryInUse(categoryId)
  }
}
