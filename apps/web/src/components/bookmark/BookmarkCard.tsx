import type { Bookmark } from '@/types/bookmark'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from '@bookmark-pro/ui'
import { Edit3, ExternalLink, Globe, Trash2 } from 'lucide-react'
import Image from 'next/image'

type BookmarkCardData = Omit<Bookmark, 'created_at' | 'user_id'> & {
  createdAt: Date | string
}

type BookmarkCardProps = {
  bookmark?: BookmarkCardData
  id?: string
  title?: string
  url?: string
  description?: string | null
  category?: {
    id: string
    name: string
    color: string
  } | null
  tags?: string[]
  createdAt?: string
  favicon?: string
  onEdit: (bookmark?: BookmarkCardData) => void
  onDelete: (id: string) => void
}

const BookmarkCard = ({
  bookmark,
  id,
  title,
  url,
  description,
  category,
  tags,
  createdAt,
  favicon,
  onEdit,
  onDelete,
}: BookmarkCardProps) => {
  // Use bookmark data if provided, otherwise use individual props
  const bookmarkData = bookmark || {
    id: id!,
    title: title!,
    url: url!,
    description: description || null,
    category_id: null,
    category: category || null,
    tags: tags || [],
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    favicon,
  }
  const handleVisit = () => {
    window.open(bookmarkData.url, '_blank')
  }

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <Card className="transition-all duration-300 group hover:shadow-card-hover animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center flex-1 min-w-0 gap-2">
            <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
              {bookmarkData.favicon ? (
                <Image
                  src={bookmarkData.favicon}
                  alt="Favicon"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              ) : (
                <Globe className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-tight truncate">{bookmarkData.title}</h3>
              <p className="text-xs truncate text-muted-foreground">
                {getDomainFromUrl(bookmarkData.url)}
              </p>
            </div>
          </div>
          <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bookmarkData)}
              className="w-8 h-8 p-0"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bookmarkData.id)}
              className="w-8 h-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <div className="space-y-2">
          {bookmarkData.category && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: bookmarkData.category.color }}
              />
              {bookmarkData.category.name}
            </Badge>
          )}

          {bookmarkData.description && (
            <div className="p-3 text-xs text-muted-foreground bg-muted rounded-lg">
              {bookmarkData.description}
            </div>
          )}

          {bookmarkData.tags && bookmarkData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmarkData?.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={handleVisit}
          className="w-full text-white bg-blue-500 hover:opacity-90"
          size="sm"
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          방문하기
        </Button>
      </CardFooter>
    </Card>
  )
}

export default BookmarkCard
