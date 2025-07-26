import { useState, useEffect } from 'react'
import { Button, Input, Label, Textarea, Badge } from '@repo/ui'
import { Plus, X } from 'lucide-react'

interface BookmarkFormProps {
  currentUrl: string
  currentTitle: string
  onSave: (data: {
    url: string
    title: string
    tags: string[]
    memo?: string
  }) => void
  onCancel: () => void
}

export default function BookmarkForm({ 
  currentUrl, 
  currentTitle,
  onSave, 
  onCancel 
}: BookmarkFormProps) {
  const [title, setTitle] = useState(currentTitle)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [memo, setMemo] = useState('')

  useEffect(() => {
    setTitle(currentTitle)
  }, [currentTitle])

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        url: currentUrl,
        title: title.trim(),
        tags,
        memo: memo.trim() || undefined
      })
    }
  }

  return (
    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">북마크 저장</h2>
        <button 
          onClick={onCancel}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1">URL</Label>
          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 break-all max-h-12 overflow-hidden">
            {currentUrl}
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">
            제목 *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="북마크 제목을 입력하세요"
            className="text-sm"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1">메모</Label>
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="북마크에 대한 메모를 남겨보세요"
            rows={2}
            maxLength={200}
            className="text-sm resize-none"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {memo.length}/200
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1">태그</Label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="태그를 입력하세요"
              className="text-sm"
            />
            <Button
              onClick={handleAddTag}
              size="sm"
              className="px-3"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 text-sm"
        >
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim()}
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm"
        >
          저장
        </Button>
      </div>
    </div>
  )
}