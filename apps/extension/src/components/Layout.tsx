import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { runWithBrowser } from "@/lib/extension";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@bookmark-pro/ui";
import { Bookmark, ExternalLink, LogOut } from "lucide-react";
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

  const handleAccountPage = async () => {
    // 계정 페이지로 이동 (향후 구현)
    const DASHBOARD_URL = process.env.WEB_URL!;
    await runWithBrowser(
      async () => {
        chrome.tabs.create({ url: DASHBOARD_URL });
      },
      () => {
        window.open(DASHBOARD_URL, "_blank");
      }
    );
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="z-10 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-500 rounded-lg">
              <Bookmark fill="currentColor" className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">BookmarkPro</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  {user && <UserProfile user={user} size="md" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col gap-2 w-48 bg-white"
                align="end"
              >
                <Button
                  size="sm"
                  className="flex justify-between p-2 text-left hover:bg-gray-100"
                  onClick={handleAccountPage}
                >
                  <span>대시보드 열기</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="flex justify-between p-2 text-left hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  <span>로그아웃</span>
                  <LogOut className="w-4 h-4" />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
