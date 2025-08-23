import { Button } from '@bookmark-pro/ui'
import { Plus } from 'lucide-react'

type PageHeaderProps = {
  bookmarkCount: number
  onAddBookmark: () => void
}

const PageHeader = ({ bookmarkCount, onAddBookmark }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">전체 북마크</h2>
        <p className="text-sm text-gray-500">({bookmarkCount}개)</p>
      </div>
      <Button
        onClick={onAddBookmark}
        size="sm"
        className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1 !rounded-button"
      >
        <Plus className="w-4 h-4" />
        <span>추가</span>
      </Button>
    </div>
  )
}

export default PageHeader
