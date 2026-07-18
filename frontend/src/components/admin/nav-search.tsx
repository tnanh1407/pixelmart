import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { SidebarInput } from '@/components/ui/sidebar'
import type { SidebarSection } from '@/config/sidebar.config'

interface NavSearchProps {
  sections: SidebarSection[]
  onFilter: (filtered: SidebarSection[]) => void
}

export function NavSearch({ sections, onFilter }: NavSearchProps) {
  const [query, setQuery] = useState('')

  const handleChange = (value: string) => {
    setQuery(value)
    const lower = value.toLowerCase().trim()

    if (!lower) {
      onFilter(sections)
      return
    }

    const filtered = sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(lower) ||
            section.title.toLowerCase().includes(lower) ||
            item.children?.some((child) =>
              child.title.toLowerCase().includes(lower)
            ),
        ),
      }))
      .filter((section) => section.items.length > 0)

    onFilter(filtered)
  }

  return (
    <div className="px-2 pt-1 pb-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        <SidebarInput
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="h-8 pl-8 text-xs"
        />
      </div>
    </div>
  )
}
