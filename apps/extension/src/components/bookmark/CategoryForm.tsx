import { Colors } from '@/constants/colors'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { CategoryFormData, categorySchema } from '@/schemas/category.schema'
import { CategoryService } from '@/services'
import { type Category } from '@/supabase/categories'
import { Button, Input, Label } from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, X } from 'lucide-react'
import { MouseEvent, useEffect, useState } from 'react'
import { FieldError, FieldErrorsImpl, Merge, useController, useForm } from 'react-hook-form'

type CategoryFormProps = {
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
  selectedCategory,
  error: errorProp,
  onSelectCategory,
}: CategoryFormProps) => {
  const [InitColor] = Colors
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const { user } = useAuth()
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

  const loadCategories = async () => {
    if (!user) return
    try {
      const categoryList = await CategoryService.fetchCategories(user.id)
      setCategories(categoryList)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast({
        title: '오류',
        description: '카테고리를 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (user) {
      loadCategories()
    }
  }, [user])

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
      const result = await CategoryService.deleteCategory(categoryToDelete.id)

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
    if (!user) {
      console.log('No user found, returning')
      return
    }

    try {
      // 새 카테고리를 임시로 생성하여 선택
      const newCategory = {
        name: data.name.trim(),
        color: data.color,
      }

      const result = await CategoryService.createCategory(newCategory, user.id)

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
        <Label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">
          카테고리
        </Label>
        <Button
          type="button"
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
              <Button
                key={cat.id}
                className={`${selectedCategory?.id === cat.id ? 'border-2 border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'} group flex justify-between w-full p-3 transition-colors rounded-xl`}
                onClick={handleSelectCategory(cat)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-medium"> {cat.name}</span>
                </div>
                <Button
                  className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded-lg bg-red-100 text-red-500 transition-all"
                  title="카테고리 삭제"
                  onClick={handleDeleteCategory(cat)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Button>
            ))}
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="p-3 space-y-2 bg-gray-50 rounded-lg">
          <div>
            <Input
              id="category"
              {...nameField}
              placeholder="카테고리를 입력하세요"
              className="text-sm rounded-lg"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {Colors.map((color) => (
              <Button
                key={color}
                type="button"
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
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors !rounded-button"
              onClick={handleSubmit(onSubmitCategory)}
            >
              추가
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowCategoryForm(false)
                reset()
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors !rounded-button"
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
