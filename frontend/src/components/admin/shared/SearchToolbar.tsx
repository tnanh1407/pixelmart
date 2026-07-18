import { Search, X } from 'lucide-react'
import type { ReactNode, FormEvent } from 'react'

interface SearchToolbarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  filter?: ReactNode
}

export default function SearchToolbar({
  placeholder,
  value,
  onChange,
  onSearch,
  filter,
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
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2 max-w-md">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 ${value ? 'pr-10' : 'pr-4'} py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
      >
        <Search size={16} />
        Tìm kiếm
      </button>
      {filter}
    </form>
  )
}
