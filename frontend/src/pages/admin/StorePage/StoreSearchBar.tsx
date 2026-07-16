import { Search, X } from 'lucide-react'
import React from 'react'

interface StoreSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function StoreSearchBar({ value, onChange, onSearch }: StoreSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  const handleClear = () => {
    onChange('')
    // Execute onSearch immediately to clear backend filters.
    // Wrap in a tiny timeout to let React finish state synchronization if needed
    // or just call onSearch. Actually, let's call it directly.
    setTimeout(() => {
      onSearch()
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2 max-w-md">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 ${
            value ? 'pr-10' : 'pr-4'
          } py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
      >
        <Search size={16} />
        Tìm kiếm
      </button>
    </form>
  )
}
