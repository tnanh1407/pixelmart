import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import ProductPagination from './ProductPagination'
import ProductSearchBar from './ProductSearchBar'
import ProductsTable from './ProductsTable'
import { useAdminProductMutations } from '@/hooks/admin/products'
import { adminService, type ProductListResponse } from '@/services/admin/admin.service'
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pagination.total} sản phẩm</p>
        </div>
      </div>

      <ProductSearchBar value={searchInput} onChange={setSearchInput} onSubmit={handleSearch} />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
        {!isLoading && products.length > 0 && (
          <ProductPagination pagination={pagination} currentPage={page} onPageChange={setPage} />
        )}
      </div>
    </div>
  )
}
