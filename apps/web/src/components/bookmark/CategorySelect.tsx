import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@bookmark-pro/ui'
import type { Category } from '../../supabase/categories'

type CategorySelectProps = {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  newCategory: string
  onNewCategoryChange: (newCategory: string) => void
}

const CategorySelect = ({
  categories,
  selectedCategory,
  onCategoryChange,
  newCategory,
  onNewCategoryChange,
}: CategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label>카테고리 *</Label>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
          onChange={(e) => onNewCategoryChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default CategorySelect
