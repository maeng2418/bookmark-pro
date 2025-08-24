import { Button } from '@bookmark-pro/ui'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Bookmark, Plus, User } from 'lucide-react'
import SearchBar from './SearchBar'

interface HeaderProps {
  onAddBookmark: () => void
  searchQuery: string
  onSearch: (query: string) => void
  onSearchChange?: (query: string) => void
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
  userEmail?: string
  user?: SupabaseUser | null
}

export const Header = ({
  onAddBookmark,
  searchQuery,
  onSearch,
  onSearchChange,
  isLoggedIn,
  onLogin,
  onLogout,
  userEmail,
  user,
}: HeaderProps) => {
  const handleSearchChange = onSearch || onSearchChange || (() => {})
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-transparent bg-blue-500 bg-clip-text">
              BookmarkPro
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="북마크 검색..."
            />
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Button onClick={onAddBookmark} className="bg-blue-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="items-center hidden gap-2 px-3 py-2 rounded-lg sm:flex bg-muted">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{userEmail || user?.email || '사용자'}</span>
                </div>
                <Button variant="outline" onClick={onLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} className="bg-blue-500 hover:opacity-90">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
