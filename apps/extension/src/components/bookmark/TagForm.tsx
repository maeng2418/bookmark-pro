import { TagFormData, tagSchema } from '@/schemas/tag.schema'
import { Badge, Button, Input, Label } from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { KeyboardEvent } from 'react'
import { FieldError, FieldErrorsImpl, Merge, useController, useForm } from 'react-hook-form'

type TagFormProp = {
  tags: string[]
  error?: Merge<
    FieldError,
    FieldErrorsImpl<{
      tag: string
    }>
  >
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

const TagForm = ({ tags, error: errorProp, onAddTag, onRemoveTag }: TagFormProp) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<TagFormData>({
    defaultValues: { tag: '' },
    resolver: zodResolver(tagSchema),
  })

  const { field: tagField } = useController({
    name: 'tag',
    control,
  })

  const handleSubmitTag = handleSubmit((data: TagFormData) => {
    const trimmedTag = data.tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onAddTag(trimmedTag)
    }
    reset()
  })

  const handleRemoveTag = (tagToRemove: string) => {
    onRemoveTag(tagToRemove)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmitTag()
    }
  }

  return (
    <div className="flex flex-col space-y-1">
      <Label className="mb-1 text-sm font-medium text-gray-700">태그</Label>
      <div className="flex mb-2 space-x-2">
        <div className="flex-1">
          <Input
            {...tagField}
            onKeyDown={handleKeyPress}
            placeholder="태그를 입력하세요"
            className="text-sm rounded-lg"
          />
          {errors.tag && <p className="mt-1 text-xs text-red-600">{errors.tag.message}</p>}
        </div>
        <Button
          type="button"
          disabled={!isValid}
          size="sm"
          className="text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600"
          onClick={handleSubmitTag}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex gap-1 items-center text-xs">
              #{tag}
              <Button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-destructive"
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      {errorProp && <p className="text-xs text-red-600">{errorProp.message}</p>}
    </div>
  )
}

export default TagForm
