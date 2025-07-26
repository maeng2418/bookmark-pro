
'use client';

import { useState, useEffect } from 'react';
import { User, getCurrentUser, signInWithGoogle, signOut, initializeGoogleAuth } from '@/lib/auth';
import { 
  Bookmark, 
  Category, 
  getBookmarks, 
  getCategories, 
  saveBookmark, 
  deleteBookmark, 
  saveCategory,
  isUrlBookmarked,
  getBookmarkByUrl,
  getCurrentTabUrl
} from '@/lib/bookmarks';
import Header from '@/components/Header';
import LoginScreen from '@/components/LoginScreen';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [savedBookmark, setSavedBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeGoogleAuth();
        const currentUser = getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          loadUserData(currentUser.id);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const loadCurrentUrl = async () => {
      try {
        const url = await getCurrentTabUrl();
        setCurrentUrl(url);
        
        if (user) {
          const bookmarked = isUrlBookmarked(url, user.id);
          setIsUrlSaved(bookmarked);
          
          if (bookmarked) {
            const bookmark = getBookmarkByUrl(url, user.id);
            setSavedBookmark(bookmark);
          }
        }
      } catch (error) {
        console.error('Failed to get current URL:', error);
      }
    };

    if (user) {
      loadCurrentUrl();
    }
  }, [user, bookmarks]);

  const loadUserData = (userId: string) => {
    const userBookmarks = getBookmarks(userId);
    const userCategories = getCategories(userId);
    setBookmarks(userBookmarks);
    setCategories(userCategories);
  };

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      loadUserData(user.id);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
    setBookmarks([]);
    setCategories([]);
    setIsUrlSaved(false);
    setSavedBookmark(null);
  };

  const handleSaveBookmark = (bookmarkData: {
    url: string;
    title: string;
    categoryId: string;
    tags: string[];
    memo?: string;
  }) => {
    if (!user) return;

    const newBookmark = saveBookmark({
      ...bookmarkData,
      userId: user.id
    });

    setBookmarks(prev => [...prev, newBookmark]);
    setShowBookmarkForm(false);
    setIsUrlSaved(true);
    setSavedBookmark(newBookmark);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    if (!user) return;

    deleteBookmark(bookmarkId, user.id);
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    
    if (savedBookmark?.id === bookmarkId) {
      setIsUrlSaved(false);
      setSavedBookmark(null);
    }
  };

  const handleDeleteCurrentBookmark = () => {
    if (savedBookmark) {
      handleDeleteBookmark(savedBookmark.id);
    }
  };

  const handleCreateCategory = (name: string, color: string) => {
    if (!user) return;

    const newCategory = saveCategory({
      name,
      color,
      userId: user.id
    });

    setCategories(prev => [...prev, newCategory]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">전체 북마크</h2>
                <p className="text-sm text-gray-500">({bookmarks.length}개)</p>
              </div>
              <button
                onClick={() => setShowBookmarkForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 !rounded-button"
              >
                <i className="ri-add-line"></i>
                <span>추가</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-global-line text-blue-600 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">현재 페이지</h3>
                  <p className="text-xs text-gray-500 truncate">{currentUrl}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isUrlSaved ? (
                  <button
                    onClick={handleDeleteCurrentBookmark}
                    className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 !rounded-button"
                  >
                    <i className="ri-delete-bin-line text-xs"></i>
                    <span>삭제</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBookmarkForm(true)}
                    className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 !rounded-button"
                  >
                    <i className="ri-bookmark-line text-xs"></i>
                    <span>북마크</span>
                  </button>
                )}
                
                <button
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-sm !rounded-button"
                >
                  <i className="ri-external-link-line text-xs"></i>
                </button>
              </div>
            </div>

            <BookmarkList 
              bookmarks={bookmarks}
              categories={categories}
              onDelete={handleDeleteBookmark}
            />
          </div>
        </div>
      </div>

      {showBookmarkForm && (
        <BookmarkForm
          currentUrl={currentUrl}
          categories={categories}
          onSave={handleSaveBookmark}
          onCancel={() => setShowBookmarkForm(false)}
          onCreateCategory={handleCreateCategory}
        />
      )}
    </div>
  );
}
