import { isChromeExtension } from "@/utils/extension";
import { Button } from "@bookmark-pro/ui";
import { Bookmark, Globe, PencilLine, Trash2 } from "lucide-react";

interface CurrentPageCardProps {
  currentTab: chrome.tabs.Tab | null;
  isCurrentUrlSaved: boolean;
  onAddBookmark: () => void;
  onDeleteCurrentBookmark: () => void;
}

const CurrentPageCard = ({
  currentTab,
  isCurrentUrlSaved,
  onAddBookmark,
  onDeleteCurrentBookmark,
}: CurrentPageCardProps) => {
  return (
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
              onClick={onDeleteCurrentBookmark}
              variant="destructive"
              size="sm"
              className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center !rounded-button"
            >
              <Trash2 width={12} height={12} />
              <span>삭제</span>
            </Button>
            <Button
              onClick={onAddBookmark}
              size="sm"
              className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-sm !rounded-button"
            >
              <PencilLine width={12} height={12} />
              <span>수정</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={onAddBookmark}
            size="sm"
            className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center !rounded-button"
          >
            <Bookmark width={14} height={14} />
            <span>북마크</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CurrentPageCard;
