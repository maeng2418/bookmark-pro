import { Input } from '@bookmark-pro/ui'
import { Search } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchBar = ({
  value,
  onChange,
  placeholder = '북마크 검색...',
  className = '',
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

export default SearchBar
