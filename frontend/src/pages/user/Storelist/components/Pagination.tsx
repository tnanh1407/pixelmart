import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 pb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
          currentPage === 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
        }`}
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
        }`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
