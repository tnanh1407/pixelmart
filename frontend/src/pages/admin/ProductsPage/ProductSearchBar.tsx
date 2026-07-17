import type { FormEvent } from 'react'
import { Search } from 'lucide-react'

interface ProductSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function ProductSearchBar({
  value,
  onChange,
  onSubmit,
}: ProductSearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-ring"
        />
      </div>
    </form>
  )
}
