import { Colors } from '@/constants/colors'
import { CategoryFormData, categorySchema } from '@/schemas/category.schema'
import {
  fetchCategories,
  saveCategory,
  deleteCategory,
  checkCategoryInUse,
} from '@/supabase/categories'
import type { Category } from '@/supabase/categories'
import { Button, Input, Label, useToast } from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/supabase-js'
import { PlusIcon, X } from 'lucide-react'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { FieldError, FieldErrorsImpl, Merge, useController, useForm } from 'react-hook-form'

type CategoryFormProps = {
  user: User | null
  selectedCategory?: Category
  error?: Merge<
    FieldError,
    FieldErrorsImpl<{
      id: string
      name: string
      color: string
      user_id: string
      created_at: string
      updated_at: string
    }>
  >
  onSelectCategory?: (category: Category) => void
}

const CategoryForm = ({
  user,
  selectedCategory,
  error: errorProp,
  onSelectCategory,
}: CategoryFormProps) => {
  const [InitColor] = Colors
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const { toast } = useToast()

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: InitColor,
    },
  })

  const { field: nameField } = useController({
    name: 'name',
    control,
  })

  const { field: colorField } = useController({
    name: 'color',
    control,
  })

  const loadCategories = useCallback(async () => {
    if (!user?.id) return
    try {
      const categoryList = await fetchCategories(user.id)
      setCategories(categoryList)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast({
        title: '오류',
        description: '카테고리를 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    }
  }, [user?.id, toast])

  useEffect(() => {
    if (user?.id) {
      loadCategories()
    }
  }, [user?.id, loadCategories])

  const handleAddCategory = () => {
    setShowCategoryForm((prev) => !prev)
  }

  const handleSelectCategory = (selectedCategory: Category) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelectCategory?.(selectedCategory)
  }

  const handleDeleteCategory = (categoryToDelete: Category) => async (e: MouseEvent) => {
    e.stopPropagation()

    if (!categoryToDelete.id) return

    try {
      // 카테고리 사용 여부 확인
      const usage = await checkCategoryInUse(categoryToDelete.id)

      if (usage.inUse) {
        toast({
          title: '삭제할 수 없음',
          description: `이 카테고리는 ${usage.count}개의 북마크에서 사용 중입니다. 먼저 해당 북마크들의 카테고리를 변경해주세요.`,
          variant: 'destructive',
        })
        return
      }

      const result = await deleteCategory(categoryToDelete.id)

      if (result.success) {
        // 카테고리 목록 다시 로드
        await loadCategories()

        toast({
          title: '카테고리 삭제됨',
          description: '카테고리가 성공적으로 삭제되었습니다.',
        })
      } else {
        toast({
          title: '오류',
          description: result.error || '카테고리 삭제에 실패했습니다.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: '오류',
        description: '카테고리 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    }
  }

  const onSubmitCategory = async (data: CategoryFormData) => {
    if (!user?.id) {
      console.log('No user found, returning')
      return
    }

    try {
      const result = await saveCategory(
        {
          name: data.name.trim(),
          color: data.color,
        },
        user.id,
      )

      if (result.success && result.data) {
        // 카테고리 목록 새로고침
        await loadCategories()

        // 새로 생성된 카테고리를 선택하고 폼을 닫음
        onSelectCategory?.(result.data)
        reset()
        setShowCategoryForm(false)

        toast({
          title: '카테고리 생성됨',
          description: `'${result.data.name}' 카테고리가 생성되었습니다.`,
        })
      } else {
        toast({
          title: '오류',
          description: result.error || '카테고리 생성에 실패했습니다.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: '오류',
        description: '카테고리 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Label htmlFor="category" className="mb-1 text-sm font-medium text-foreground">
          카테고리
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center p-0 text-sm text-blue-500 hover:text-blue-600"
          onClick={handleAddCategory}
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
              <div
                key={cat.id}
                className={`${
                  selectedCategory?.id === cat.id
                    ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border border-border bg-muted/50 hover:bg-muted'
                } group flex justify-between w-full p-3 transition-colors rounded-lg cursor-pointer`}
                onClick={handleSelectCategory(cat)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-all"
                  title="카테고리 삭제"
                  onClick={handleDeleteCategory(cat)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="p-3 space-y-2 bg-muted/30 rounded-lg border">
          <div>
            <Input
              id="category"
              {...nameField}
              placeholder="카테고리를 입력하세요"
              className="text-sm"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {Colors.map((color) => (
              <Button
                key={color}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => colorField.onChange(color)}
                className={`w-6 h-6 p-0 rounded-full border-2 ${
                  colorField.value === color ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && <p className="text-xs text-red-600">{errors.color.message}</p>}
          <div className="flex space-x-2">
            <Button
              disabled={!isValid}
              size="sm"
              className="px-3 py-1 bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
              onClick={handleSubmit(onSubmitCategory)}
            >
              추가
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCategoryForm(false)
                reset()
              }}
              className="px-3 py-1 text-sm transition-colors"
            >
              취소
            </Button>
          </div>
        </div>
      )}
      {errorProp && <p className="text-xs text-red-600">{errorProp.message}</p>}
    </>
  )
}

export default CategoryForm
