import type { Bookmark, BookmarkFormData } from '@/types/bookmark'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from '@bookmark-pro/ui'
import { useState } from 'react'
import CategorySelect from './CategorySelect'
import TagInput from './TagInput'

type BookmarkFormBookmark = Omit<Bookmark, 'created_at' | 'user_id' | 'description'> & {
  createdAt: Date
}

type BookmarkFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (bookmark: BookmarkFormData) => void
  categories: string[]
  editingBookmark?: BookmarkFormBookmark
}

const BookmarkForm = ({
  open,
  onOpenChange,
  onSave,
  categories,
  editingBookmark,
}: BookmarkFormProps) => {
  const { toast } = useToast()
  const [title, setTitle] = useState(editingBookmark?.title || '')
  const [url, setUrl] = useState(editingBookmark?.url || '')
  const [category, setCategory] = useState(editingBookmark?.category || '')
  const [newCategory, setNewCategory] = useState('')
  const [tags, setTags] = useState<string[]>(editingBookmark?.tags || [])

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
      category: finalCategory,
      tags: tags.filter((tag) => tag.trim()),
    })

    // Reset form
    setTitle('')
    setUrl('')
    setCategory('')
    setNewCategory('')
    setTags([])
    onOpenChange(false)

    toast({
      title: '성공',
      description: editingBookmark ? '북마크가 수정되었습니다.' : '북마크가 저장되었습니다.',
    })
  }

  const handleClose = () => {
    setTitle('')
    setUrl('')
    setCategory('')
    setNewCategory('')
    setTags([])
    onOpenChange(false)
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

          <CategorySelect
            categories={categories}
            selectedCategory={category}
            onCategoryChange={setCategory}
            newCategory={newCategory}
            onNewCategoryChange={setNewCategory}
          />

          <div className="space-y-2">
            <Label>태그</Label>
            <TagInput tags={tags} onTagsChange={setTags} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
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

export default BookmarkForm
