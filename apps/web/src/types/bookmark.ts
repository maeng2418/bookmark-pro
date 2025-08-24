export type Bookmark = {
  id: string
  title: string
  url: string
  description?: string | null
  category: string
  tags: string[] | null
  created_at: string
  favicon?: string | null
  user_id: string
}

export type BookmarkFormData = {
  title: string
  url: string
  category: string
  tags: string[]
  description?: string
  favicon?: string
}

export type ViewMode = 'grid' | 'list'
