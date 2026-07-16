import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StorePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function StorePagination({ page, totalPages, onPageChange }: StorePaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Trang {page} / {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
