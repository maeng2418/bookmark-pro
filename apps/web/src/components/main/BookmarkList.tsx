import BookmarkCard from '@/components/bookmark/BookmarkCard'
import type { Bookmark, ViewMode } from '@/types/bookmark'
import { Button } from '@bookmark-pro/ui'
import { BookmarkPlus } from 'lucide-react'

type BookmarkListProps = {
  bookmarks: Bookmark[]
  filteredBookmarks: Bookmark[]
  searchQuery: string
  viewMode: ViewMode
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onAddBookmark: () => void
}

const BookmarkList = ({
  bookmarks,
  filteredBookmarks,
  searchQuery,
  viewMode,
  onEdit,
  onDelete,
  onAddBookmark,
}: BookmarkListProps) => {
  if (filteredBookmarks.length === 0) {
    return (
      <div className="py-16 space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-primary rounded-2xl">
          <BookmarkPlus className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground">
            {searchQuery ? '검색 결과가 없습니다' : '북마크가 없습니다'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? '다른 키워드로 검색해보세요' : '첫 번째 북마크를 추가해보세요!'}
          </p>
        </div>
        {!searchQuery && (
          <Button
            onClick={onAddBookmark}
            className="text-white bg-gradient-primary hover:opacity-90"
          >
            북마크 추가하기
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
      }
    >
      {filteredBookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          id={bookmark.id}
          title={bookmark.title}
          url={bookmark.url}
          category={bookmark.category}
          tags={bookmark.tags || []}
          createdAt={bookmark.created_at}
          favicon={bookmark.favicon || undefined}
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark.id)}
        />
      ))}
    </div>
  )
}

export default BookmarkList
