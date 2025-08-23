export interface Bookmark {
  id: string
  url: string
  title: string
  tags: string[]
  memo?: string
  userId?: string
  createdAt: string
}

export type CreateBookmarkData = Omit<Bookmark, 'id' | 'createdAt' | 'userId'>
