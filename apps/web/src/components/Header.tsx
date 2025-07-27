import { Button, Input } from "@bookmark-pro/ui";
import { Bookmark, Plus, Search, User } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  onAddBookmark: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchChange?: (query: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userEmail?: string;
  user?: SupabaseUser;
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
  const handleSearchChange = onSearch || onSearchChange || (() => {});
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-bookmark-gradient">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-bookmark-gradient bg-clip-text text-transparent">
              BookmarkPro
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="북마크 검색..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Button
                onClick={onAddBookmark}
                className="bg-bookmark-gradient hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                추가
              </Button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {userEmail || user?.email || "사용자"}
                  </span>
                </div>
                <Button variant="outline" onClick={onLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLogin}
                className="bg-bookmark-gradient hover:opacity-90"
              >
                구글 로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
