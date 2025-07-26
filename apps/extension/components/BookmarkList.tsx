
'use client';

import { useState } from 'react';
import { Bookmark, Category } from '@/lib/bookmarks';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  categories: Category[];
  onDelete: (bookmarkId: string) => void;
}

export default function BookmarkList({ bookmarks, categories, onDelete }: BookmarkListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesCategory = selectedCategory === 'all' || bookmark.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.memo && bookmark.memo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="북마크 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <i className="ri-grid-line text-sm"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <i className="ri-list-unordered text-sm"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } !rounded-button`}
          >
            전체
          </button>
          {categories.map(category => {
            const count = bookmarks.filter(b => b.categoryId === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } !rounded-button`}
                style={selectedCategory === category.id ? { backgroundColor: category.color } : {}}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}>
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-bookmark-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500 text-sm">
              {searchQuery ? '검색 결과가 없습니다' : '저장된 북마크가 없습니다'}
            </p>
          </div>
        ) : (
          filteredBookmarks.map(bookmark => {
            const category = getCategoryById(bookmark.categoryId);
            return (
              <div
                key={bookmark.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {category && (
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-xs text-gray-500">{category.name}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(bookmark.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 text-sm truncate">
                      {bookmark.title}
                    </h3>
                    
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 truncate block mb-2"
                    >
                      {bookmark.url}
                    </a>
                    
                    {bookmark.memo && (
                      <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">{bookmark.memo}</p>
                      </div>
                    )}
                    
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {bookmark.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-3">
                    <button
                      onClick={() => window.open(bookmark.url, '_blank')}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-sm !rounded-button"
                    >
                      <i className="ri-external-link-line"></i>
                    </button>
                    <button
                      onClick={() => onDelete(bookmark.id)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-red-50 rounded-lg text-red-500 text-sm"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
