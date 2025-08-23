import {
  fetchBookmarks,
  saveBookmark,
  updateBookmark,
  deleteBookmark,
  searchBookmarks,
  searchBookmarksByTags,
} from '@/supabase/bookmarks'
import type {
  BookmarkApiResponse,
  BookmarkCreateData,
  BookmarkType,
  BookmarkUpdateData,
} from '@/types'

export class BookmarkService {
  static async fetchBookmarks(userId: string): Promise<BookmarkType[]> {
    return fetchBookmarks(userId)
  }

  static async searchBookmarks(
    userId: string,
    searchQuery: string,
    categoryId?: string,
  ): Promise<BookmarkType[]> {
    return searchBookmarks(userId, searchQuery, categoryId)
  }

  static async searchBookmarksByTags(userId: string, tags: string[]): Promise<BookmarkType[]> {
    return searchBookmarksByTags(userId, tags)
  }

  static async createBookmark(
    bookmarkData: BookmarkCreateData,
    userId: string,
  ): Promise<BookmarkApiResponse> {
    return saveBookmark(bookmarkData, userId)
  }

  static async updateBookmark(
    bookmarkId: string,
    updates: BookmarkUpdateData,
  ): Promise<BookmarkApiResponse> {
    return updateBookmark(bookmarkId, updates)
  }

  static async deleteBookmark(bookmarkId: string): Promise<BookmarkApiResponse> {
    return deleteBookmark(bookmarkId)
  }
}
