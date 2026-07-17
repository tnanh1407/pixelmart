import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { IPagination } from '@/types/product.types'

interface ProductPaginationProps {
  pagination: IPagination
  currentPage: number
  onPageChange: (page: number) => void
}

export default function ProductPagination({
  pagination,
  currentPage,
  onPageChange,
}: ProductPaginationProps) {
  if (pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Trang {pagination.page} / {pagination.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
          disabled={currentPage === pagination.totalPages}
          aria-label="Trang sau"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
