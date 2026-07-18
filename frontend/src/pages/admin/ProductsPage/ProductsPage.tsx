import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { adminService, type ProductListResponse } from '@/services/admin/admin.service'
import { useAdminProductMutations } from '@/hooks/admin/products'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import ProductsTable from './ProductsTable'
import type { IPagination } from '@/types/product.types'

const emptyPagination: IPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery<ProductListResponse>({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminService.getProducts({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const products = data?.products || []
  const pagination = data?.pagination || emptyPagination
  const {
    toggleActiveMutation,
    toggleFeaturedMutation,
    deleteMutation,
  } = useAdminProductMutations(products)

  const handleSearch = () => {
    setSearch(searchInput.trim())
    setPage(1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text capitalize">Quản lý sản phẩm</h1>
          <p className="text-sm text-text-muted mt-1"><span className='font-bold capitalize text-base'>Tổng: </span>{pagination.total} sản phẩm</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="mb-6 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`w-full pl-10 ${searchInput ? 'pr-10' : 'pr-4'} py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer capitalize">
          <Search size={16} /> Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductsTable
          products={products}
          isLoading={isLoading}
          onToggleActive={toggleActiveMutation.mutate}
          isToggleActivePending={toggleActiveMutation.isPending}
          onToggleFeatured={toggleFeaturedMutation.mutate}
          isToggleFeaturedPending={toggleFeaturedMutation.isPending}
          onDelete={deleteMutation.mutate}
          isDeletePending={deleteMutation.isPending}
        />

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-text-muted whitespace-nowrap shrink-0">Trang {pagination.page} / {pagination.totalPages}</p>
            <div className="shrink-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className={page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
