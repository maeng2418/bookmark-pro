import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@bookmark-pro/ui'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { Bookmark } from '../types/bookmark'
import type { Category } from '../supabase/categories'

type EditingBookmark = {
  id: string
  title: string
  url: string
  category_id: string | null
  tags: string[]
  createdAt: Date
  favicon?: string
}

type AddBookmarkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'user_id'>) => void
  categories: Category[]
  editingBookmark?: EditingBookmark
}

const AddBookmarkDialog = ({
  open,
  onOpenChange,
  onSave,
  categories,
  editingBookmark,
}: AddBookmarkDialogProps) => {
  const { toast } = useToast()
  const [title, setTitle] = useState(editingBookmark?.title || '')
  const [url, setUrl] = useState(editingBookmark?.url || '')
  const [category, setCategory] = useState(editingBookmark?.category_id || '')
  const [newCategory, setNewCategory] = useState('')
  const [tags, setTags] = useState<string[]>(editingBookmark?.tags || [])
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    if (!title.trim() || !url.trim()) {
      toast({
        title: '오류',
        description: '제목과 URL은 필수 입력 항목입니다.',
        variant: 'destructive',
      })
      return
    }

    const finalCategory = newCategory.trim() || category
    if (!finalCategory) {
      toast({
        title: '오류',
        description: '카테고리를 선택하거나 새로 만들어주세요.',
        variant: 'destructive',
      })
      return
    }

    try {
      new URL(url)
    } catch {
      toast({
        title: '오류',
        description: '올바른 URL을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    onSave({
      title: title.trim(),
      url: url.trim(),
      category_id: finalCategory,
      tags: tags.filter((tag) => tag.trim()),
    })

    // Reset form
    setTitle('')
    setUrl('')
    setCategory('')
    setNewCategory('')
    setTags([])
    setNewTag('')
    onOpenChange(false)

    toast({
      title: '성공',
      description: editingBookmark ? '북마크가 수정되었습니다.' : '북마크가 저장되었습니다.',
    })
  }

  const addTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBookmark ? '북마크 수정' : '새 북마크 추가'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="북마크 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>카테고리 *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="새 카테고리 만들기"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => {})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>태그</Label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 후 엔터"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
              />
              <Button onClick={addTag} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:opacity-90">
            {editingBookmark ? '수정' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddBookmarkDialog
