import { useLocation, useNavigate } from "react-router-dom";
import BookmarkForm from "../components/BookmarkForm";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function BookmarkFormPage() {
  const { loading, isAuthenticated } = useAuthGuard(true);
  const location = useLocation();
  const navigate = useNavigate();

  type EditBookmark = {
    id: string;
    title: string;
    url: string;
    description: string | null;
    category: string;
    category_color: string | null;
    tags: string[] | null;
  };
  const state =
    (location.state as {
      currentUrl?: string;
      currentTitle?: string;
      editBookmark?: EditBookmark;
    }) || {};
  const { currentUrl = "", currentTitle = "", editBookmark } = state;

  const handleSave = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white w-96 h-60">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  // 인증되지 않은 사용자는 렌더링하지 않음 (useAuthGuard에서 리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null;
  }

  console.log(location.state || {});

  return (
    <div className="bg-white w-96">
      <BookmarkForm
        currentUrl={currentUrl}
        currentTitle={currentTitle}
        initialBookmark={editBookmark}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
