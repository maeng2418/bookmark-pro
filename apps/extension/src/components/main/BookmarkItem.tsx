import { BookmarkType } from "@/types";
import { Badge, Button } from "@bookmark-pro/ui";
import { PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BookmarkItemProps = {
  bookmark: BookmarkType;
  onDelete: (bookmarkId: string) => Promise<boolean>;
  loading?: boolean;
};

const BookmarkItem = ({
  bookmark,
  onDelete,
  loading = false,
}: BookmarkItemProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      key={bookmark.id}
      className="p-3 bg-white rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
    >
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center mb-1 space-x-2">
            {bookmark.category && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: bookmark.category.color || "#6B7280",
                  }}
                />
                <span>{bookmark.category.name}</span>
              </div>
            )}
            <span className="text-xs text-gray-400">
              {formatDate(bookmark.created_at)}
            </span>
          </div>
          <div className="flex items-center ml-2 space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate("/bookmark-form", {
                  state: { editBookmark: bookmark },
                });
              }}
              className="flex justify-center items-center w-7 h-7 text-gray-600 hover:bg-gray-100"
            >
              <PencilLine size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await onDelete(bookmark.id);
              }}
              disabled={loading}
              className="flex justify-center items-center w-7 h-7 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <h3 className="mb-1 text-sm font-medium text-gray-800 truncate">
          {bookmark.title || "제목 없음"}
        </h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-2 text-xs text-blue-600 truncate hover:text-blue-800"
        >
          {bookmark.url}
        </a>

        {bookmark.description && (
          <p className="p-3 text-xs text-gray-600 bg-gray-50 rounded-lg">
            {bookmark.description}
          </p>
        )}

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.map((tag) => (
              <Badge
                key={tag}
                className="inline-block px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkItem;
