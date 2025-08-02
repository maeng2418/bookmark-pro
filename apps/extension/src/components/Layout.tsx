import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Bookmark, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";

const Layout = () => {
  const { user } = useAuthGuard(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
              <Bookmark fill="currentColor" className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">BookmarkPro</h1>
          </div>
          <div className="flex items-center space-x-2">
            {user && <UserProfile user={user} size="sm" />}
            <button
              onClick={handleSignOut}
              className="p-1 text-gray-500 rounded hover:text-gray-700"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
