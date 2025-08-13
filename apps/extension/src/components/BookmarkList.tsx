import { BookmarkType } from "@/types";
import {
  Badge,
  Button,
  Input,
  ToggleGroup,
  ToggleGroupItem,
} from "@bookmark-pro/ui";
import { BookmarkIcon, PencilLine, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "@/lib/categories";
import { useDebounce } from "@/hooks/useDebounce";

interface BookmarkListProps {
  bookmarks: BookmarkType[];
  categories: Category[];
  onDelete: (bookmarkId: string) => Promise<boolean>;
  loading?: boolean;
}

const BookmarkList = ({
  bookmarks,
  categories,
  onDelete,
  loading = false,
}: BookmarkListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const lowerCaseSearch = debouncedSearchQuery.toLowerCase();
    const matchesCategory =
      selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesSearch =
      !debouncedSearchQuery ||
      bookmark.title?.toLowerCase().includes(lowerCaseSearch) ||
      bookmark.url.toLowerCase().includes(lowerCaseSearch) ||
      bookmark.tags?.some((tag) =>
        tag.toLowerCase().includes(lowerCaseSearch)
      ) ||
      (bookmark.description &&
        bookmark.description.toLowerCase().includes(lowerCaseSearch));

    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="북마크 검색..."
            className="pl-10 w-full text-sm rounded-lg border-gray-300 transition-colors"
          />
        </div>

        <ToggleGroup
          type="single"
          value={selectedCategory}
          className="flex flex-wrap gap-2 justify-start"
        >
          <ToggleGroupItem
            value="all"
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } !rounded-button`}
            onClick={() => setSelectedCategory("all")}
          >
            전체
          </ToggleGroupItem>
          {categories.map((category) => {
            return (
              <ToggleGroupItem
                key={category.id}
                value={category.name}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                  selectedCategory === category.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } !rounded-button`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {filteredBookmarks.length === 0 ? (
          <div className="py-10 text-center">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
              <BookmarkIcon width={24} height={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {debouncedSearchQuery
                ? "검색 결과가 없습니다."
                : "저장된 북마크가 없습니다."}
            </p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
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
                            backgroundColor:
                              bookmark.category_color || "#6B7280",
                          }}
                        />
                        <span>{bookmark.category}</span>
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
          ))
        )}
      </div>
    </>
  );
};

export default BookmarkList;
