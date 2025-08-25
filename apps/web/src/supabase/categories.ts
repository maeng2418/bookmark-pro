import { supabase } from './client'

export type Category = {
  id: string
  name: string
  color: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export const saveCategory = async (
  categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  userId: string,
): Promise<{ success: boolean; error?: string; data?: Category }> => {
  try {
    // Add new category
    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...categoryData,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (duplicate category name)
      if (error.code === '23505') {
        return {
          success: false,
          error: '이미 존재하는 카테고리명입니다.',
        }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error saving category:', error)
    return {
      success: false,
      error: '카테고리 저장에 실패했습니다.',
    }
  }
}

export const fetchCategories = async (userId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const checkCategoryInUse = async (
  categoryId: string,
): Promise<{ inUse: boolean; count: number }> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id', { count: 'exact' })
      .eq('category_id', categoryId)

    if (error) throw error

    const count = data?.length || 0
    return { inUse: count > 0, count }
  } catch (error) {
    console.error('Error checking category usage:', error)
    return { inUse: false, count: 0 }
  }
}

export const deleteCategory = async (
  categoryId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 카테고리가 사용 중인지 확인
    const usage = await checkCategoryInUse(categoryId)

    if (usage.inUse) {
      return {
        success: false,
        error: `이 카테고리는 ${usage.count}개의 북마크에서 사용 중입니다. 먼저 해당 북마크들의 카테고리를 변경해주세요.`,
      }
    }

    const { error } = await supabase.from('categories').delete().eq('id', categoryId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return {
      success: false,
      error: '카테고리 삭제에 실패했습니다.',
    }
  }
}