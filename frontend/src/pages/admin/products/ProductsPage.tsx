import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Package } from 'lucide-react'
import { adminService, type ProductListResponse } from '@/services/admin/admin.service'
import { PageHeader, SearchToolbar, Pagination, LoadingState, EmptyState, DeleteDialog } from '@/components/admin/shared'
import type { IPagination } from '@/types/product.types'
import ProductTable from './ProductTable'

const emptyPagination: IPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<ProductListResponse>({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminService.getProducts({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const products = data?.products || []
  const pagination = data?.pagination || emptyPagination

  return (
    <div>
      <PageHeader
        title="Quản lý sản phẩm"
        description={`Tổng: ${pagination.total} sản phẩm`}
      />

      <SearchToolbar
        placeholder="Tìm kiếm sản phẩm..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <ProductTable
          products={products}
          isLoading={isLoading}
          onDelete={setDeleteTargetId}
        />
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="sản phẩm"
        onConfirm={() => { if (deleteTargetId) { setDeleteTargetId(null) } }}
      />
    </div>
  )
}
