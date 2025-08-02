import {
  Badge,
  Button,
  Input,
  Label,
  Textarea,
  useToast,
} from "@bookmark-pro/ui";
import { Plus, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { saveBookmark } from "../lib/bookmarks";
import {
  Category,
  deleteCategory,
  fetchCategories,
  saveCategory,
} from "../lib/categories";

interface BookmarkFormProps {
  currentUrl: string;
  currentTitle: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function BookmarkForm({
  currentUrl,
  currentTitle,
  onSave,
  onCancel,
}: BookmarkFormProps) {
  const [url, setUrl] = useState(currentUrl);
  const [title, setTitle] = useState(currentTitle);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [category, setCategory] = useState("일반");
  const [loading, setLoading] = useState(false);
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryColor, setSelectedCategoryColor] = useState("#3B82F6");

  const { user } = useAuth();
  const { toast } = useToast();

  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    const categoryList = await fetchCategories(user.id);
    setCategories(categoryList);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !user) return;

    setLoading(true);
    try {
      const result = await saveBookmark(
        {
          title: title.trim(),
          url: currentUrl,
          description: memo.trim() || undefined,
          category,
          categoryColor: selectedCategoryColor,
          tags,
        },
        user.id
      );

      if (result.success) {
        toast({
          title: "북마크 추가됨",
          description: "새 북마크가 성공적으로 추가되었습니다.",
        });
        onSave();
      } else {
        toast({
          title: "오류",
          description: result.error || "북마크 저장에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      toast({
        title: "오류",
        description: "북마크 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !user) return;

    const result = await saveCategory(
      {
        name: newCategoryName.trim(),
        color: newCategoryColor,
      },
      user.id
    );

    if (result.success && result.data) {
      setCategories([result.data, ...categories]);
      setCategory(result.data.name);
      setSelectedCategoryColor(result.data.color);
      setNewCategoryName("");
      setNewCategoryColor("#3B82F6");
      setShowCategoryForm(false);
      toast({
        title: "카테고리 생성됨",
        description: "새 카테고리가 성공적으로 생성되었습니다.",
      });
    } else {
      toast({
        title: "오류",
        description: result.error || "카테고리 생성에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSelectCategory = (selectedCategory: Category) => {
    setCategory(selectedCategory.name);
    setSelectedCategoryColor(selectedCategory.color);
  };

  const handleDeleteCategory = async (
    categoryToDelete: Category,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // 카테고리 선택 이벤트 방지

    if (!categoryToDelete.id) return;

    const result = await deleteCategory(categoryToDelete.id);

    if (result.success) {
      // 삭제된 카테고리가 현재 선택된 카테고리라면 초기화
      if (category === categoryToDelete.name) {
        setCategory("일반");
        setSelectedCategoryColor("#3B82F6");
      }

      // 카테고리 목록 다시 로드
      await loadCategories();

      toast({
        title: "카테고리 삭제됨",
        description: "카테고리가 성공적으로 삭제되었습니다.",
      });
    } else {
      toast({
        title: "오류",
        description: result.error || "카테고리 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">북마크 저장</h2>
        <Button
          onClick={onCancel}
          className="flex items-center justify-center w-6 h-6 transition-colors rounded hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col space-y-1">
          <Label
            htmlFor="url"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            URL *
          </Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL을 입력하세요"
            className="text-sm rounded-lg"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label
            htmlFor="title"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            제목 *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="북마크 제목을 입력하세요"
            className="text-sm rounded-lg"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="mb-1 text-sm font-medium text-gray-700">설명</Label>
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="북마크에 대한 설명을 남겨보세요"
            rows={3}
            maxLength={200}
            className="text-sm rounded-lg resize-none"
          />
          <div className="mt-1 text-xs text-right text-gray-500">
            {memo.length}/200
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="category"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            카테고리
          </Label>
          <Button
            className="flex items-center p-0 text-sm text-blue-500 hover:text-blue-600"
            onClick={() => setShowCategoryForm((prev) => !prev)}
          >
            <PlusIcon size={14} />
            <span>새 카테고리</span>
          </Button>
        </div>

        {/* 기존 카테고리 선택 */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  className={`${category === cat.name ? "border-2 border-blue-500 bg-blue-50" : "border-transparent bg-gray-50 hover:bg-gray-100"} group flex justify-between w-full p-3 transition-colors rounded-xl`}
                  onClick={() => handleSelectCategory(cat)}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium"> {cat.name}</span>
                  </div>
                  <Button
                    onClick={(e) => handleDeleteCategory(cat, e)}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded-lg bg-red-100 text-red-500 transition-all"
                    title="카테고리 삭제"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Button>
              ))}
            </div>
          </div>
        )}

        {showCategoryForm && (
          <div className="p-3 space-y-2 rounded-lg bg-gray-50">
            <Input
              id="category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="카테고리를 입력하세요"
              className="text-sm rounded-lg"
            />
            <div className="flex items-center space-x-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 p-0 rounded-full border-2 ${
                    newCategoryColor === color
                      ? "border-gray-400"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateCategory}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors !rounded-button"
              >
                추가
              </Button>
              <Button
                onClick={() => setShowCategoryForm(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors !rounded-button"
              >
                취소
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-1">
          <Label className="mb-1 text-sm font-medium text-gray-700">태그</Label>
          <div className="flex mb-2 space-x-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="태그를 입력하세요"
              className="text-sm rounded-lg"
            />
            <Button
              onClick={handleAddTag}
              size="sm"
              className="flex-1 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex pt-3 mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors !rounded-button"
        >
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || loading || !user}
          className="flex-1 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600"
        >
          {loading ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
