import { Button, Input } from '@bookmark-pro/ui'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Bookmark, Plus, Search, User } from 'lucide-react'

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
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-blue-500">
              BookmarkPro
            </h1>
          </div>

          <div className="flex-1 mx-4 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="북마크 검색..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {isLoggedIn && (
              <Button onClick={onAddBookmark} className="bg-blue-500 hover:opacity-90">
                <Plus className="mr-2 w-4 h-4" />
                추가
              </Button>
            )}

            {isLoggedIn ? (
              <div className="flex gap-2 items-center">
                <div className="hidden gap-2 items-center px-3 py-2 rounded-lg sm:flex bg-muted">
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
