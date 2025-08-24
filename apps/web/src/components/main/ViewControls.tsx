import { Button } from '@bookmark-pro/ui'
import { Grid3X3, List } from 'lucide-react'
import type { ViewMode } from '../../types/bookmark'

type ViewControlsProps = {
  selectedCategory: string
  filteredBookmarksCount: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const ViewControls = ({
  selectedCategory,
  filteredBookmarksCount,
  viewMode,
  onViewModeChange,
}: ViewControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          {selectedCategory === '전체' ? '전체 북마크' : `${selectedCategory} 카테고리`}
        </h2>
        <span className="text-sm text-muted-foreground">({filteredBookmarksCount}개)</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default ViewControls
