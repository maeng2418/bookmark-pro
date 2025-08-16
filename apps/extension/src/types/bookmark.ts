import type { Category } from "../supabase/categories";

export interface BookmarkType {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  category: Category;
  tags?: string[] | null;
  favicon?: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface BookmarkCreateData {
  title: string;
  url: string;
  description?: string;
  category: Category;
  tags: string[];
  favicon?: string;
}

export interface BookmarkUpdateData extends BookmarkCreateData {
  userId: string;
}

export interface BookmarkApiResponse {
  success: boolean;
  error?: string;
}