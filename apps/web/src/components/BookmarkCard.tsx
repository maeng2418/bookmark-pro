import { Button, Badge, Card, CardContent, CardFooter, CardHeader } from "@repo/ui";
import { ExternalLink, Trash2, Edit3, Globe } from "lucide-react";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: Date | string;
  favicon?: string;
}

interface BookmarkCardProps2 {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: string;
  favicon?: string;
  onEdit: () => void;
  onDelete: () => void;
}

interface BookmarkCardProps {
  bookmark?: Bookmark;
  id?: string;
  title?: string;
  url?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  favicon?: string;
  onEdit: (bookmark?: Bookmark) => void;
  onDelete: (id: string) => void;
}

export const BookmarkCard = ({ 
  bookmark, 
  id, 
  title, 
  url, 
  category, 
  tags, 
  createdAt, 
  favicon, 
  onEdit, 
  onDelete 
}: BookmarkCardProps) => {
  // Use bookmark data if provided, otherwise use individual props
  const bookmarkData = bookmark || {
    id: id!,
    title: title!,
    url: url!,
    category: category!,
    tags: tags || [],
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    favicon
  };
  const handleVisit = () => {
    window.open(bookmarkData.url, '_blank');
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-muted flex-shrink-0">
              {bookmarkData.favicon ? (
                <img src={bookmarkData.favicon} alt="" className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight truncate">{bookmarkData.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{getDomainFromUrl(bookmarkData.url)}</p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bookmarkData)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bookmarkData.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {bookmarkData.category}
          </Badge>
          
          {bookmarkData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmarkData.tags.map((tag, index) => (
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
          className="w-full bg-bookmark-gradient hover:opacity-90 text-white"
          size="sm"
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          방문하기
        </Button>
      </CardFooter>
    </Card>
  );
};