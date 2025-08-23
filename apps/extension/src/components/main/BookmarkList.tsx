import { useDebounce } from '@/hooks/useDebounce'
import { Category } from '@/supabase/categories'
import { BookmarkType } from '@/types'
import { Input, ToggleGroup, ToggleGroupItem } from '@bookmark-pro/ui'
import { BookmarkIcon, Search } from 'lucide-react'
import { useState } from 'react'
import BookmarkItem from './BookmarkItem'

type BookmarkListProps = {
  bookmarks: BookmarkType[]
  categories: Category[]
  onDelete: (bookmarkId: string) => Promise<boolean>
  loading?: boolean
  onSearch?: (query: string, categoryId?: string) => Promise<BookmarkType[]>
  onSearchByTags?: (tags: string[]) => Promise<BookmarkType[]>
}

const BookmarkList = ({
  bookmarks,
  categories,
  onDelete,
  loading = false,
  onSearch,
  onSearchByTags,
}: BookmarkListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const lowerCaseSearch = debouncedSearchQuery.toLowerCase()
    // 전체 카테고리 선택시 모든 북마크 표시, 특정 카테고리 선택시 해당 카테고리만 표시
    const matchesCategory = !selectedCategory || bookmark.category.id === selectedCategory.id
    const matchesSearch =
      !debouncedSearchQuery ||
      bookmark.title?.toLowerCase().includes(lowerCaseSearch) ||
      bookmark.url.toLowerCase().includes(lowerCaseSearch) ||
      bookmark.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseSearch)) ||
      (bookmark.description && bookmark.description.toLowerCase().includes(lowerCaseSearch))

    return matchesCategory && matchesSearch
  })

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="북마크 검색..."
            className="pl-10 w-full text-sm rounded-lg border-gray-300 transition-colors"
          />
        </div>

        <ToggleGroup
          type="single"
          value={selectedCategory?.id}
          className="flex flex-wrap gap-2 justify-start"
        >
          <ToggleGroupItem
            value="all"
            className={`h-auto px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !selectedCategory
                ? 'text-white bg-blue-500'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            } !rounded-button`}
            onClick={() => setSelectedCategory(null)}
          >
            전체
          </ToggleGroupItem>
          {categories.map((category) => {
            return (
              <ToggleGroupItem
                key={category.id!}
                value={category.id!}
                className={`h-auto px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                  selectedCategory?.id === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } !rounded-button`}
                onClick={() => setSelectedCategory(category)}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        {filteredBookmarks.length === 0 ? (
          <div className="py-10 text-center">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
              <BookmarkIcon width={24} height={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {debouncedSearchQuery ? '검색 결과가 없습니다.' : '저장된 북마크가 없습니다.'}
            </p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              loading={loading}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </>
  )
}

export default BookmarkList
