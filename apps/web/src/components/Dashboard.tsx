'use client'

import Layout from '@/components/common/Layout'
import { supabase } from '@/supabase/client'
import {
  Button,
  Card,
  CardContent,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  useToast,
} from '@bookmark-pro/ui'
import type { Session, User } from '@supabase/supabase-js'
import { BookmarkPlus, Grid3X3, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bookmark, ViewMode } from '../types/bookmark'
import AddBookmarkDialog from './AddBookmarkDialog'
import BookmarkCard from './bookmark/BookmarkCard'
import CategoryFilter from './CategoryFilter'
import { Header } from './common/Header'
import LoadingSpinner from './common/LoadingSpinner'

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Fetch bookmarks from Supabase
  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast({
        title: '오류',
        description: '북마크를 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    }
  }, [toast])

  // Auth effect
  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      setUser(_session?.user ?? null)

      if (!_session) {
        router.push('/auth')
      } else {
        // Fetch bookmarks when user logs in
        setTimeout(() => {
          fetchBookmarks()
        }, 0)
      }
    })

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: _session } }) => {
      setUser(_session?.user ?? null)
      setLoading(false)

      if (!_session) {
        router.push('/auth')
      } else {
        fetchBookmarks()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, fetchBookmarks])

  // Memoized filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesCategory = selectedCategory === '전체' || bookmark.category === selectedCategory
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bookmark.tags &&
          bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchesCategory && matchesSearch
    })
  }, [bookmarks, selectedCategory, searchQuery])

  // Memoized categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(bookmarks.map((b) => b.category)))
    return ['전체', ...uniqueCategories]
  }, [bookmarks])

  // Memoized bookmark counts
  const bookmarkCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: bookmarks.length }
    bookmarks.forEach((bookmark) => {
      counts[bookmark.category] = (counts[bookmark.category] || 0) + 1
    })
    return counts
  }, [bookmarks])

  const handleSaveBookmark = async (
    bookmarkData: Omit<Bookmark, 'id' | 'created_at' | 'user_id'>,
  ) => {
    if (!user) return

    try {
      if (editingBookmark) {
        // Update existing bookmark
        const { error } = await supabase
          .from('bookmarks')
          .update({
            title: bookmarkData.title,
            url: bookmarkData.url,
            description: bookmarkData.description,
            category: bookmarkData.category,
            tags: bookmarkData.tags,
            favicon: bookmarkData.favicon,
          })
          .eq('id', editingBookmark.id)

        if (error) throw error

        toast({
          title: '북마크 수정됨',
          description: '북마크가 성공적으로 수정되었습니다.',
        })
      } else {
        // Check for duplicate URL
        const { data: existingBookmarks } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('url', bookmarkData.url)

        if (existingBookmarks && existingBookmarks.length > 0) {
          toast({
            title: '중복된 URL',
            description: '이미 저장된 URL입니다.',
            variant: 'destructive',
          })
          return
        }

        // Add new bookmark
        const { error } = await supabase.from('bookmarks').insert({
          ...bookmarkData,
          user_id: user.id,
        })

        if (error) throw error

        toast({
          title: '북마크 추가됨',
          description: '새 북마크가 성공적으로 추가되었습니다.',
        })
      }

      // Refresh bookmarks
      fetchBookmarks()
      setIsAddDialogOpen(false)
      setEditingBookmark(null)
    } catch (error) {
      console.error('Error saving bookmark:', error)
      toast({
        title: '오류',
        description: '북마크 저장에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsAddDialogOpen(true)
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) throw error

      toast({
        title: '북마크 삭제됨',
        description: '북마크가 성공적으로 삭제되었습니다.',
      })

      // Refresh bookmarks
      fetchBookmarks()
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      toast({
        title: '오류',
        description: '북마크 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: '오류',
        description: '로그아웃에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <Header
        onAddBookmark={() => setIsAddDialogOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        isLoggedIn={!!user}
        onLogin={() => router.push('/auth')}
        onLogout={handleLogout}
        user={user}
      />

      <div className="container px-4 py-6 mx-auto">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden w-64 space-y-4 lg:block">
            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="p-4">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(category: string | null) =>
                    setSelectedCategory(category || '전체')
                  }
                  bookmarkCounts={bookmarkCounts}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Mobile Category Filter */}
            <div className="lg:hidden">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="justify-between w-full">
                    카테고리 필터
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                    >
                      <path
                        d="m4.5 6 3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={(category: string | null) =>
                          setSelectedCategory(category || '전체')
                        }
                        bookmarkCounts={bookmarkCounts}
                      />
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedCategory === '전체' ? '전체 북마크' : `${selectedCategory} 카테고리`}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({filteredBookmarks.length}개)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Bookmarks Grid/List */}
            {filteredBookmarks.length === 0 ? (
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
                    onClick={() => setIsAddDialogOpen(true)}
                    className="text-white bg-gradient-primary hover:opacity-90"
                  >
                    북마크 추가하기
                  </Button>
                )}
              </div>
            ) : (
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
                    onEdit={() => handleEditBookmark(bookmark)}
                    onDelete={() => handleDeleteBookmark(bookmark.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsAddDialogOpen(open)
          if (!open) setEditingBookmark(null)
        }}
        onSave={handleSaveBookmark}
        categories={categories.filter((c) => c !== '전체')}
        editingBookmark={
          editingBookmark
            ? {
                id: editingBookmark.id,
                title: editingBookmark.title,
                url: editingBookmark.url,
                category: editingBookmark.category,
                tags: editingBookmark.tags || [],
                createdAt: new Date(editingBookmark.created_at),
                favicon: editingBookmark.favicon || undefined,
              }
            : undefined
        }
      />
    </Layout>
  )
}

export default Dashboard
