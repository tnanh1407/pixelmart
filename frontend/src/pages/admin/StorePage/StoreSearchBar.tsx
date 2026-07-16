import { Search } from 'lucide-react'
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

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </form>
  )
}
