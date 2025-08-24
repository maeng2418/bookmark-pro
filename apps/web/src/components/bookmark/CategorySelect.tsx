import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@bookmark-pro/ui'

type CategorySelectProps = {
  categories: string[]
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
            <SelectItem key={cat} value={cat}>
              {cat}
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
