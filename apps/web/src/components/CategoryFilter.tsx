import { Badge, Button, ScrollArea } from '@bookmark-pro/ui'
import { Folder, FolderOpen } from 'lucide-react'
import type { Category } from '../supabase/categories'

type CategoryFilterProps = {
  categories: Category[]
  selectedCategory: Category | null
  onCategorySelect: (category: Category | null) => void
  bookmarkCounts: Record<string, number>
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategorySelect,
  bookmarkCounts,
}: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Folder className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">카테고리</h3>
      </div>

      <ScrollArea className="h-fit max-h-60">
        <div className="space-y-1">
          <Button
            variant={selectedCategory === null ? 'default' : 'ghost'}
            onClick={() => onCategorySelect(null)}
            className={`w-full justify-between text-left h-auto py-2 px-3 ${
              selectedCategory === null ? 'bg-blue-500 text-white' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-3 h-3" />
              <span className="text-sm">전체</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Object.values(bookmarkCounts).reduce((sum, count) => sum + count, 0)}
            </Badge>
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory?.id === category.id ? 'default' : 'ghost'}
              onClick={() => onCategorySelect(category)}
              className={`w-full justify-between text-left h-auto py-2 px-3 ${
                selectedCategory?.id === category.id ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm truncate">{category.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {bookmarkCounts[category.id] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default CategoryFilter
