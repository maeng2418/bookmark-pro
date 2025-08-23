import type {
  BookmarkApiResponse,
  BookmarkCreateData,
  BookmarkType,
  BookmarkUpdateData,
} from '@/types'
import { supabase } from './client'

export const saveBookmark = async (
  bookmarkData: BookmarkCreateData,
  userId: string,
): Promise<BookmarkApiResponse> => {
  try {
    // Check for duplicate URL
    const { data: existingBookmarks } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('url', bookmarkData.url)

    if (existingBookmarks && existingBookmarks.length > 0) {
      return {
        success: false,
        error: '이미 저장된 URL입니다.',
      }
    }

    // Add new bookmark
    const { error } = await supabase.from('bookmarks').insert({
      title: bookmarkData.title,
      url: bookmarkData.url,
      description: bookmarkData.description || null,
      category_id: bookmarkData.category.id,
      tags: bookmarkData.tags,
      favicon: bookmarkData.favicon,
      user_id: userId,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error saving bookmark:', error)
    return {
      success: false,
      error: '북마크 저장에 실패했습니다.',
    }
  }
}

export const fetchBookmarks = async (userId: string): Promise<BookmarkType[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(
        `
        *,
        categories (
          id,
          name,
          color
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    const normalized: BookmarkType[] = (data || []).map(
      (row: {
        id: string
        title: string
        url: string
        description: string | null
        category_id: string | null
        categories: {
          id: string
          name: string
          color: string
        } | null
        tags: string[] | null
        favicon: string | null
        user_id: string
        created_at: string
      }) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description ?? undefined,
        category: {
          id: row.categories?.id || 'default',
          name: row.categories?.name || 'General',
          color: row.categories?.color || '#gray',
        },
        tags: row.tags ?? [],
        favicon: row.favicon ?? undefined,
        user_id: row.user_id,
        created_at: row.created_at,
      }),
    )
    return normalized
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return []
  }
}

export const deleteBookmark = async (bookmarkId: string): Promise<BookmarkApiResponse> => {
  try {
    const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return {
      success: false,
      error: '북마크 삭제에 실패했습니다.',
    }
  }
}

export const updateBookmark = async (
  bookmarkId: string,
  updates: BookmarkUpdateData,
): Promise<BookmarkApiResponse> => {
  try {
    // Check for duplicate URL except current bookmark
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', updates.userId)
      .eq('url', updates.url)
      .neq('id', bookmarkId)

    if (existing && existing.length > 0) {
      return { success: false, error: '이미 저장된 URL입니다.' }
    }

    const { error } = await supabase
      .from('bookmarks')
      .update({
        title: updates.title,
        url: updates.url,
        description: updates.description ?? null,
        category_id: updates.category.id,
        tags: updates.tags,
      })
      .eq('id', bookmarkId)
      .eq('user_id', updates.userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating bookmark:', error)
    return { success: false, error: '북마크 수정에 실패했습니다.' }
  }
}

export const searchBookmarks = async (
  userId: string,
  searchQuery: string,
  categoryId?: string,
): Promise<BookmarkType[]> => {
  try {
    let query = supabase
      .from('bookmarks')
      .select(
        `
        *,
        categories (
          id,
          name,
          color
        )
      `,
      )
      .eq('user_id', userId)

    // Add full-text search
    if (searchQuery.trim()) {
      query = query.textSearch('title,description,url', searchQuery.trim(), {
        type: 'websearch',
        config: 'english',
      })
    }

    // Filter by category if specified
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    const normalized: BookmarkType[] = (data || []).map(
      (row: {
        id: string
        title: string
        url: string
        description: string | null
        category_id: string | null
        categories: {
          id: string
          name: string
          color: string
        } | null
        tags: string[] | null
        favicon: string | null
        user_id: string
        created_at: string
      }) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description ?? undefined,
        category: {
          id: row.categories?.id || 'default',
          name: row.categories?.name || 'General',
          color: row.categories?.color || '#gray',
        },
        tags: row.tags ?? [],
        favicon: row.favicon ?? undefined,
        user_id: row.user_id,
        created_at: row.created_at,
      }),
    )
    return normalized
  } catch (error) {
    console.error('Error searching bookmarks:', error)
    return []
  }
}

export const searchBookmarksByTags = async (
  userId: string,
  tags: string[],
): Promise<BookmarkType[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(
        `
        *,
        categories (
          id,
          name,
          color
        )
      `,
      )
      .eq('user_id', userId)
      .overlaps('tags', tags)
      .order('created_at', { ascending: false })

    if (error) throw error

    const normalized: BookmarkType[] = (data || []).map(
      (row: {
        id: string
        title: string
        url: string
        description: string | null
        category_id: string | null
        categories: {
          id: string
          name: string
          color: string
        } | null
        tags: string[] | null
        favicon: string | null
        user_id: string
        created_at: string
      }) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description ?? undefined,
        category: {
          id: row.categories?.id || 'default',
          name: row.categories?.name || 'General',
          color: row.categories?.color || '#gray',
        },
        tags: row.tags ?? [],
        favicon: row.favicon ?? undefined,
        user_id: row.user_id,
        created_at: row.created_at,
      }),
    )
    return normalized
  } catch (error) {
    console.error('Error searching bookmarks by tags:', error)
    return []
  }
}
