import { BookmarkFormData, bookmarkSchema } from '@/schemas/bookmark.schema'
import type { Category } from '@/supabase/categories'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  useToast,
} from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/supabase-js'
import { useEffect, useMemo, useState } from 'react'
import { useController, useForm } from 'react-hook-form'
import CategoryForm from './CategoryForm'
import TagForm from './TagForm'

type InitialBookmark = {
  id: string
  title: string
  url: string
  description: string | null
  category: Category | null
  tags: string[] | null
}

type BookmarkFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  currentUrl?: string
  currentTitle?: string
  initialBookmark?: InitialBookmark
  onSave: (data: BookmarkFormData) => Promise<void>
  onCancel?: () => void
}

const BookmarkForm = ({
  open,
  onOpenChange,
  user,
  currentUrl = '',
  currentTitle = '',
  initialBookmark,
  onSave,
  onCancel,
}: BookmarkFormProps) => {
  const isEdit = !!initialBookmark
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const defaultValues = useMemo(
    () => ({
      url: initialBookmark?.url || currentUrl,
      title: initialBookmark?.title || currentTitle,
      description: initialBookmark?.description || '',
      category: initialBookmark?.category || undefined,
      tags: initialBookmark?.tags || [],
    }),
    [initialBookmark, currentUrl, currentTitle],
  )

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<BookmarkFormData>({
    defaultValues: defaultValues,
    resolver: zodResolver(bookmarkSchema),
  })

  const { field: urlField } = useController({
    name: 'url',
    control,
  })

  const { field: titleField } = useController({
    name: 'title',
    control,
  })

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  })

  const { field: categoryField } = useController({
    name: 'category',
    control,
  })

  const { field: tagsField } = useController({
    name: 'tags',
    control,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleAddTag = (tag: string) => {
    const currentTags = tagsField.value || []
    if (!currentTags.includes(tag)) {
      tagsField.onChange([...currentTags, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = tagsField.value || []
    tagsField.onChange(currentTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmitForm = handleSubmit(async (data: BookmarkFormData) => {
    if (!user) return

    setLoading(true)
    try {
      await onSave(data)

      toast({
        title: isEdit ? '북마크 수정됨' : '북마크 추가됨',
        description: isEdit
          ? '북마크가 성공적으로 수정되었습니다.'
          : '새 북마크가 성공적으로 추가되었습니다.',
      })

      handleClose()
    } catch (error) {
      console.error('Error saving bookmark:', error)
      toast({
        title: '오류',
        description: isEdit ? '북마크 수정에 실패했습니다.' : '북마크 저장에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  })

  const handleSelectCategory = (selectedCategory: Category) => {
    categoryField.onChange(selectedCategory)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
    onCancel?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEdit ? '북마크 수정' : '북마크 저장'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL *
            </Label>
            <Input id="url" {...urlField} placeholder="URL을 입력하세요" className="text-sm" />
            {errors.url && <p className="text-xs text-red-600">{errors.url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              제목 *
            </Label>
            <Input
              id="title"
              {...titleField}
              placeholder="북마크 제목을 입력하세요"
              className="text-sm"
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">설명</Label>
            <Textarea
              {...descriptionField}
              placeholder="북마크에 대한 설명을 남겨보세요"
              rows={3}
              maxLength={200}
              className="text-sm resize-none"
            />
            <div className="text-xs text-right text-muted-foreground">
              {(descriptionField.value || '').length}/200
            </div>
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <CategoryForm
              user={user}
              selectedCategory={categoryField.value}
              onSelectCategory={handleSelectCategory}
              error={errors.category}
            />
          </div>

          <div className="space-y-2">
            <TagForm
              tags={tagsField.value || []}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              error={errors.tags}
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            disabled={!isDirty || loading || !user}
            onClick={handleSubmitForm}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            {loading ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookmarkForm
