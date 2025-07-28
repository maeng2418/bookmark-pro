import { useLocation, useNavigate } from "react-router-dom";
import BookmarkForm from "../components/BookmarkForm";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function BookmarkFormPage() {
  const { loading, isAuthenticated } = useAuthGuard(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUrl = "", currentTitle = "" } = location.state || {};

  const handleSave = () => {
    window.close();
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-96 h-60 flex items-center justify-center bg-white">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  // 인증되지 않은 사용자는 렌더링하지 않음 (useAuthGuard에서 리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-96 bg-white">
      <BookmarkForm
        currentUrl={currentUrl}
        currentTitle={currentTitle}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}