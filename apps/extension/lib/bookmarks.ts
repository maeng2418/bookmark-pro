
import { v4 as uuidv4 } from 'uuid';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  categoryId: string;
  tags: string[];
  memo?: string;
  createdAt: Date;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export const getBookmarks = (userId: string): Bookmark[] => {
  if (typeof window === 'undefined') return [];
  
  const bookmarks = localStorage.getItem(`bookmarks_${userId}`);
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const getCategories = (userId: string): Category[] => {
  if (typeof window === 'undefined') return [];
  
  const categories = localStorage.getItem(`categories_${userId}`);
  const defaultCategories: Category[] = [
    { id: 'default', name: '기본', color: '#3B82F6', userId }
  ];
  
  return categories ? JSON.parse(categories) : defaultCategories;
};

export const saveBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark => {
  const newBookmark: Bookmark = {
    ...bookmark,
    id: uuidv4(),
    createdAt: new Date()
  };
  
  const bookmarks = getBookmarks(bookmark.userId);
  bookmarks.push(newBookmark);
  
  localStorage.setItem(`bookmarks_${bookmark.userId}`, JSON.stringify(bookmarks));
  return newBookmark;
};

export const deleteBookmark = (bookmarkId: string, userId: string): void => {
  const bookmarks = getBookmarks(userId);
  const filteredBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
  
  localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(filteredBookmarks));
};

export const saveCategory = (category: Omit<Category, 'id'>): Category => {
  const newCategory: Category = {
    ...category,
    id: uuidv4()
  };
  
  const categories = getCategories(category.userId);
  categories.push(newCategory);
  
  localStorage.setItem(`categories_${category.userId}`, JSON.stringify(categories));
  return newCategory;
};

export const isUrlBookmarked = (url: string, userId: string): boolean => {
  const bookmarks = getBookmarks(userId);
  return bookmarks.some(bookmark => bookmark.url === url);
};

export const getBookmarkByUrl = (url: string, userId: string): Bookmark | null => {
  const bookmarks = getBookmarks(userId);
  return bookmarks.find(bookmark => bookmark.url === url) || null;
};

export const getCurrentTabUrl = (): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      resolve(window.location.href);
    } else {
      resolve('https://example.com');
    }
  });
};
