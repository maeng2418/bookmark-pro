import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { BookmarkFormData, bookmarkSchema } from '@/schemas/bookmark.schema'
import { saveBookmark, updateBookmark } from '@/supabase/bookmarks'
import type { Category } from '@/supabase/categories'
import { Button, Input, Label, Textarea } from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useController, useForm } from 'react-hook-form'
import CategoryForm from './CategoryForm'
import TagForm from './TagForm'

type InitialBookmark = {
  id: string
  title: string
  url: string
  description: string | null
  category: Category
  tags: string[] | null
}

type BookmarkFormProps = {
  currentUrl?: string
  currentTitle?: string
  initialBookmark?: InitialBookmark
  onSave: () => void
  onCancel: () => void
}

const BookmarkForm = ({
  currentUrl = '',
  currentTitle = '',
  initialBookmark,
  onSave,
  onCancel,
}: BookmarkFormProps) => {
  const isEdit = !!initialBookmark
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  const defaultValues = useMemo(
    () => ({
      url: initialBookmark?.url || currentUrl,
      title: initialBookmark?.title || currentTitle,
      description: initialBookmark?.description || '',
      category: initialBookmark?.category,
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
      let result: { success: boolean; error?: string }
      if (isEdit && initialBookmark?.id) {
        result = await updateBookmark(initialBookmark.id, {
          title: data.title.trim(),
          url: data.url.trim(),
          description: data.description?.trim() || undefined,
          category: data.category,
          tags: data.tags,
          userId: user.id,
        })
      } else {
        result = await saveBookmark(
          {
            title: data.title.trim(),
            url: data.url.trim(),
            description: data.description?.trim() || undefined,
            category: data.category,
            tags: data.tags,
          },
          user.id,
        )
      }

      if (result.success) {
        toast({
          title: isEdit ? '북마크 수정됨' : '북마크 추가됨',
          description: isEdit
            ? '북마크가 성공적으로 수정되었습니다.'
            : '새 북마크가 성공적으로 추가되었습니다.',
        })
        onSave()
      } else {
        toast({
          title: '오류',
          description:
            result.error ||
            (isEdit ? '북마크 수정에 실패했습니다.' : '북마크 저장에 실패했습니다.'),
          variant: 'destructive',
        })
      }
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          {isEdit ? '북마크 수정' : '북마크 저장'}
        </h2>
        <Button
          onClick={onCancel}
          className="flex justify-center items-center w-6 h-6 rounded transition-colors hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-3">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="url" className="mb-1 text-sm font-medium text-gray-700">
            URL *
          </Label>
          <Input
            id="url"
            {...urlField}
            placeholder="URL을 입력하세요"
            className="text-sm rounded-lg"
          />
          {errors.url && <p className="text-xs text-red-600">{errors.url.message}</p>}
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700">
            제목 *
          </Label>
          <Input
            id="title"
            {...titleField}
            placeholder="북마크 제목을 입력하세요"
            className="text-sm rounded-lg"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="mb-1 text-sm font-medium text-gray-700">설명</Label>
          <Textarea
            {...descriptionField}
            placeholder="북마크에 대한 설명을 남겨보세요"
            rows={3}
            maxLength={200}
            className="text-sm rounded-lg resize-none"
          />
          <div className="mt-1 text-xs text-right text-gray-500">
            {(descriptionField.value || '').length}/200
          </div>
          {errors.description && (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <CategoryForm
          selectedCategory={categoryField.value}
          onSelectCategory={handleSelectCategory}
          error={errors.category}
        />

        <TagForm
          tags={tagsField.value || []}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          error={errors.tags}
        />

        <div className="flex pt-3 mt-4 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors !rounded-button"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || loading || !user}
            className="flex-1 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {loading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BookmarkForm
