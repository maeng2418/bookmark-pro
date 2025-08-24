import { Badge, Button, Input } from '@bookmark-pro/ui'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

type TagInputProps = {
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

const TagInput = ({ tags, onTagsChange }: TagInputProps) => {
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="태그 입력 후 엔터"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={addTag} size="sm" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagInput
