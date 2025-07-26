import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { BookmarkCard, type Bookmark } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookmarkPlus, Grid3X3, List, SortAsc } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for initial bookmarks
const initialBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "React 공식 문서",
    url: "https://react.dev",
    category: "개발",
    tags: ["react", "javascript", "frontend"],
    createdAt: new Date("2024-01-15"),
    favicon: "https://react.dev/favicon.ico"
  },
  {
    id: "2", 
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    category: "개발",
    tags: ["css", "design", "frontend"],
    createdAt: new Date("2024-01-16"),
    favicon: "https://tailwindcss.com/favicon.ico"
  },
  {
    id: "3",
    title: "YouTube",
    url: "https://youtube.com",
    category: "엔터테인먼트",
    tags: ["video", "entertainment"],
    createdAt: new Date("2024-01-17"),
    favicon: "https://youtube.com/favicon.ico"
  }
];

export const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock logged in state

  // Filter bookmarks based on category and search
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesCategory = !selectedCategory || bookmark.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(bookmarks.map(b => b.category))).sort();
  }, [bookmarks]);

  // Get bookmark counts by category
  const bookmarkCounts = useMemo(() => {
    return bookmarks.reduce((counts, bookmark) => {
      counts[bookmark.category] = (counts[bookmark.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, [bookmarks]);

  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(prev => prev.map(b => 
        b.id === editingBookmark.id 
          ? { ...bookmarkData, id: editingBookmark.id, createdAt: editingBookmark.createdAt }
          : b
      ));
      setEditingBookmark(undefined);
    } else {
      // Check for duplicate URL
      const isDuplicate = bookmarks.some(b => b.url === bookmarkData.url);
      if (isDuplicate) {
        toast({
          title: "중복된 URL",
          description: "이미 저장된 URL입니다.",
          variant: "destructive"
        });
        return;
      }

      // Add new bookmark
      const newBookmark: Bookmark = {
        ...bookmarkData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsAddDialogOpen(true);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    toast({
      title: "삭제 완료",
      description: "북마크가 삭제되었습니다."
    });
  };

  const handleLogin = () => {
    // Mock login - in real app, integrate with Google OAuth
    setIsLoggedIn(true);
    toast({
      title: "로그인 성공",
      description: "구글 계정으로 로그인되었습니다."
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다."
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onAddBookmark={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
          isLoggedIn={false}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="p-4 rounded-2xl bg-bookmark-gradient w-fit mx-auto">
              <BookmarkPlus className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">북마크를 스마트하게 관리하세요</h2>
              <p className="text-muted-foreground">
                URL을 카테고리별로 정리하고, 태그로 분류하여 쉽게 찾아보세요.
              </p>
            </div>
            <Button onClick={handleLogin} className="bg-bookmark-gradient hover:opacity-90">
              구글로 시작하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddBookmark={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userEmail="user@example.com"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-4 hidden lg:block">
            <Card>
              <CardContent className="p-4">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  bookmarkCounts={bookmarkCounts}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {selectedCategory ? `${selectedCategory} 카테고리` : "전체 북마크"}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({filteredBookmarks.length}개)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Mobile Category Filter */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-4">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    bookmarkCounts={bookmarkCounts}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Bookmarks Grid/List */}
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">북마크가 없습니다</h3>
                  <p className="text-muted-foreground">첫 번째 북마크를 추가해보세요!</p>
                </div>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-bookmark-gradient hover:opacity-90"
                >
                  북마크 추가하기
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              }>
                {filteredBookmarks.map(bookmark => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={handleEditBookmark}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingBookmark(undefined);
        }}
        onSave={handleSaveBookmark}
        categories={categories}
        editingBookmark={editingBookmark}
      />
    </div>
  );
};