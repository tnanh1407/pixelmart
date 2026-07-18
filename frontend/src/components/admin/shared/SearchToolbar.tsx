import { Search, X } from 'lucide-react'
import type { ReactNode, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchToolbarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  filter?: ReactNode
  className?: string
}

export default function SearchToolbar({
  placeholder,
  value,
  onChange,
  onSearch,
  filter,
  className,
}: SearchToolbarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  const handleClear = () => {
    onChange('')
    setTimeout(() => onSearch(), 0)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('mb-6 flex flex-wrap items-center gap-2', className)}
    >
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn('w-full pl-10', value && 'pr-10')}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <Button type="submit">
        <Search size={16} />
        Tìm kiếm
      </Button>
      {filter}
    </form>
  )
}
