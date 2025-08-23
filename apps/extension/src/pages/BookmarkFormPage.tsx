import BookmarkForm from '@/components/bookmark/BookmarkForm'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Category } from '@/supabase/categories'
import { useLocation, useNavigate } from 'react-router-dom'

type EditBookmark = {
  id: string
  title: string
  url: string
  description: string | null
  category: Category
  tags: string[] | null
}

const BookmarkFormPage = () => {
  const { loading, isAuthenticated } = useAuthGuard(true)
  const location = useLocation()
  const navigate = useNavigate()

  const state =
    (location.state as {
      currentUrl?: string
      currentTitle?: string
      editBookmark?: EditBookmark
    }) || {}
  const { currentUrl = '', currentTitle = '', editBookmark } = state

  const handleSave = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-96 h-60 bg-white">
        <div className="text-gray-500">로딩중...</div>
      </div>
    )
  }

  // 인증되지 않은 사용자는 렌더링하지 않음 (useAuthGuard에서 리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div>
      <BookmarkForm
        currentUrl={currentUrl}
        currentTitle={currentTitle}
        initialBookmark={editBookmark}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default BookmarkFormPage
