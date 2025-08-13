import BookmarkList from "@/components/BookmarkList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@bookmark-pro/ui";
import { Bookmark, Globe, PencilLine, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCurrentTab } from "@/hooks/useCurrentTab";
import { useToast } from "@/contexts/ToastContext";
import { isChromeExtension } from "@/lib/extension";


const MainPage = () => {
  const { user, loading: authLoading } = useAuthGuard(true);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { bookmarks, categories, loading, error, deleteBookmark } = useBookmarks(user);
  const { currentTab, isCurrentUrlSaved, currentBookmark } = useCurrentTab(bookmarks);

  const handleAddBookmark = () => {
    if (currentTab) {
      navigate("/bookmark-form", {
        state: {
          currentUrl: currentTab.url || "",
          currentTitle: currentTab.title || "",
        },
      });
    }
  };

  const handleDeleteCurrentBookmark = async () => {
    if (currentBookmark) {
      await deleteBookmark(currentBookmark.id);
    }
  };

  if (authLoading || (loading && bookmarks.length === 0)) {
    return (
      <div className="flex justify-center items-center w-80 h-96 bg-white">
        <LoadingSpinner text="로딩 중..." />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-grow px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">전체 북마크</h2>
          <p className="text-sm text-gray-500">({bookmarks.length}개)</p>
        </div>
        <Button
          onClick={handleAddBookmark}
          size="sm"
          className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1 !rounded-button"
        >
          <Plus className="w-4 h-4" />
          <span>추가</span>
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3 space-x-3">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded-lg">
              <Globe width={14} height={14} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900">현재 페이지</h3>
              <p className="text-xs text-gray-500 truncate">
                {isChromeExtension
                  ? currentTab?.url || "URL을 불러오는 중..."
                  : window.location.href}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isCurrentUrlSaved ? (
              <>
                <Button
                  onClick={handleDeleteCurrentBookmark}
                  variant="destructive"
                  size="sm"
                  className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center !rounded-button"
                >
                  <Trash2 width={12} height={12} />
                  <span>삭제</span>
                </Button>
                <Button
                  onClick={handleAddBookmark}
                  size="sm"
                  className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-sm !rounded-button"
                >
                  <PencilLine width={12} height={12} />
                  <span>수정</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddBookmark}
                size="sm"
                className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center !rounded-button"
              >
                <Bookmark width={14} height={14} />
                <span>북마크</span>
              </Button>
            )}
          </div>
        </div>

        <BookmarkList
          bookmarks={bookmarks}
          categories={categories}
          onDelete={deleteBookmark}
        />
      </div>
    </div>
  );
};

export default MainPage;
