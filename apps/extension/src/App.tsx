import { useState, useEffect } from 'react'
import { Button } from '@repo/ui'
import { Bookmark, Plus, LogOut } from 'lucide-react'
import BookmarkForm from './components/BookmarkForm'
import AuthScreen from './components/AuthScreen'
import { useAuth } from './contexts/AuthContext'
import { getCurrentTab } from './lib/extension'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCurrentTab = async () => {
      try {
        const tab = await getCurrentTab()
        setCurrentTab(tab)
      } catch (error) {
        console.error('Failed to get current tab:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentTab()
  }, [])

  const handleSaveSuccess = () => {
    setShowForm(false)
    window.close()
  }

  const handleSignOut = async () => {
    await signOut()
    setShowForm(false)
  }

  if (authLoading || loading) {
    return (
      <div className="w-80 h-60 flex items-center justify-center bg-white">
        <div className="text-gray-500">로딩중...</div>
      </div>
    )
  }

  // 로그인하지 않은 경우 인증 화면 표시
  if (!user) {
    return <AuthScreen />
  }

  if (showForm && currentTab) {
    return (
      <div className="w-96 bg-white">
        <BookmarkForm
          currentUrl={currentTab.url || ''}
          currentTitle={currentTab.title || ''}
          onSave={handleSaveSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="w-80 bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">BookmarkPro</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
            title="로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            {user.email}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {currentTab && (
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-1">현재 페이지</h2>
              <p className="text-sm text-gray-900 font-medium truncate">
                {currentTab.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentTab.url}
              </p>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              북마크에 추가
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => {
              chrome.tabs.create({ url: 'http://localhost:8080' })
            }}
          >
            BookmarkPro 웹 열기
          </Button>
        </div>
      </div>
    </div>
  )
}