import BookmarkList from '@/components/main/BookmarkList'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PageHeader from '@/components/common/PageHeader'
import CurrentPageCard from '@/components/main/CurrentPageCard'
import { useNavigate } from 'react-router-dom'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useCurrentTab } from '@/hooks/useCurrentTab'

const MainPage = () => {
  const { user, loading: authLoading } = useAuthGuard(true)
  const navigate = useNavigate()
  const { bookmarks, categories, loading, deleteBookmark, searchBookmarks, searchBookmarksByTags } =
    useBookmarks(user)
  const { currentTab, isCurrentUrlSaved, currentBookmark } = useCurrentTab(bookmarks)

  const handleAddBookmark = () => {
    if (currentTab) {
      navigate('/bookmark-form', {
        state: {
          currentUrl: currentTab.url || '',
          currentTitle: currentTab.title || '',
        },
      })
    }
  }

  const handleDeleteCurrentBookmark = async () => {
    if (currentBookmark) {
      await deleteBookmark(currentBookmark.id)
    }
  }

  if (authLoading || (loading && bookmarks.length === 0)) {
    return (
      <div className="flex justify-center items-center w-80 h-96 bg-white">
        <LoadingSpinner text="로딩 중..." />
      </div>
    )
  }

  return (
    <div className="overflow-y-auto flex-grow px-4 py-6">
      <PageHeader bookmarkCount={bookmarks.length} onAddBookmark={handleAddBookmark} />

      <div className="flex flex-col space-y-4">
        <CurrentPageCard
          currentTab={currentTab}
          isCurrentUrlSaved={isCurrentUrlSaved}
          onAddBookmark={handleAddBookmark}
          onDeleteCurrentBookmark={handleDeleteCurrentBookmark}
        />

        <BookmarkList
          bookmarks={bookmarks}
          categories={categories}
          onDelete={deleteBookmark}
          loading={loading}
          onSearch={searchBookmarks}
          onSearchByTags={searchBookmarksByTags}
        />
      </div>
    </div>
  )
}

export default MainPage
