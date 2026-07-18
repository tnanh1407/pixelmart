import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Package, Star } from 'lucide-react'
import { adminService, type ProductListResponse } from '@/services/admin/admin.service'
import { useAdminProductMutations } from '@/hooks/admin/products'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, StatusBadge, DeleteDialog } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import type { IProduct } from '@/types/product.types'
import type { IPagination } from '@/types/product.types'
import { Badge } from '@/components/ui/badge'

const emptyPagination: IPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

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
  const { toggleActiveMutation, toggleFeaturedMutation, deleteMutation } = useAdminProductMutations(products)

  const columns: Column<IProduct>[] = [
    {
      header: 'Sản phẩm',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center"><Package size={20} className="text-text-muted" /></div>
            )}
          </div>
          <div className="min-w-0">
            <p className="max-w-[220px] truncate text-sm font-medium text-text">{p.name}</p>
            <p className="text-xs text-text-muted">{p.brand || 'Chưa có thương hiệu'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Giá',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => p.discountPrice ? (
        <div>
          <p className="text-sm font-medium text-destructive">{formatPrice(p.discountPrice)}</p>
          <p className="text-xs text-text-muted line-through">{formatPrice(p.price)}</p>
        </div>
      ) : <p className="text-sm font-medium text-text">{formatPrice(p.price)}</p>,
    },
    {
      header: 'Kho',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => <span className={p.stock <= 0 ? 'text-sm font-medium text-destructive' : 'text-sm font-medium text-text'}>{p.stock}</span>,
    },
    {
      header: 'Đánh giá',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm text-text">{p.ratingsAverage?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-text-muted">({p.ratingsQuantity || 0})</span>
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge active={p.isActive} activeLabel="Đang bán" inactiveLabel="Ẩn" />
          {p.isFeatured && <Badge variant="secondary" className="border-none bg-amber-500/10 text-amber-700 hover:bg-amber-500/20">Nổi bật</Badge>}
        </div>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => toggleActiveMutation.mutate(p._id)} disabled={toggleActiveMutation.isPending}
            className={`h-8 w-8 cursor-pointer rounded-lg flex items-center justify-center transition-colors ${p.isActive ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : 'text-text-muted hover:bg-gray-100'}`}
            title={p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}>
            {p.isActive ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
            )}
          </button>
          <button onClick={() => toggleFeaturedMutation.mutate(p._id)} disabled={toggleFeaturedMutation.isPending}
            className={`h-8 w-8 cursor-pointer rounded-lg flex items-center justify-center transition-colors ${p.isFeatured ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' : 'text-text-muted hover:bg-gray-100'}`}
            title={p.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}>
            <Star size={16} className={p.isFeatured ? 'fill-amber-500' : ''} />
          </button>
          <button onClick={() => setDeleteTargetId(p._id)} disabled={deleteMutation.isPending}
            className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            title="Xóa">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      ),
    },
  ]

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState icon={Package} message="Không tìm thấy sản phẩm nào" />
        ) : (
          <DataTable columns={columns} data={products} keyExtractor={(p) => p._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="sản phẩm"
        onConfirm={() => { if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) } }}
      />
    </div>
  )
}
