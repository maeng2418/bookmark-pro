export type Bookmark = {
  id: string
  title: string
  url: string
  description?: string | null
  category_id: string | null
  category?: {
    id: string
    name: string
    color: string
  } | null
  tags: string[] | null
  created_at: string
  favicon?: string | null
  user_id: string
}

export type BookmarkFormData = {
  title: string
  url: string
  category_id: string
  tags: string[]
  description?: string
  favicon?: string
}

export type ViewMode = 'grid' | 'list'
