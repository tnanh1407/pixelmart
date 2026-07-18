import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Package, Star, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { ProductListResponse } from '@/services/admin/products.service'
import {
  PageHeader,
  SearchToolbar,
  DataTable,
  Pagination,
  LoadingState,
  EmptyState,
  DeleteDialog,
  StatusBadge,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import type { IProduct } from '@/types/product.types'
import type { IPagination } from '@/types/product.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const emptyPagination: IPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

export default function ProductListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery<ProductListResponse>({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminService.getProducts({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const products = data?.products || []
  const pagination = data?.pagination || emptyPagination

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })

  const toggleActiveMutation = useMutation({
    mutationFn: (product: IProduct) =>
      adminService.updateProduct(product._id, { isActive: !product.isActive }),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: (product: IProduct) =>
      adminService.updateProduct(product._id, { isFeatured: !product.isFeatured }),
    onSuccess: () => { invalidate(); toast.success('Cập nhật nổi bật thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => { invalidate(); toast.success('Xóa sản phẩm thành công') },
    onError: () => toast.error('Không thể xóa sản phẩm'),
  })

  const columns: Column<IProduct>[] = [
    {
      header: 'Sản phẩm',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(`/admin/products/${p._id}`)}
            className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted cursor-pointer hover:opacity-85 transition-opacity"
          >
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package size={20} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p
              onClick={() => navigate(`/admin/products/${p._id}`)}
              className="max-w-[220px] truncate text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {p.name}
            </p>
            <p className="text-xs text-muted-foreground">{p.sku || 'Chưa có mã SKU'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Giá',
      accessor: 'price',
      sortable: true,
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) =>
        p.discountPrice ? (
          <div>
            <p className="text-sm font-medium text-destructive">{formatPrice(p.discountPrice)}</p>
            <p className="text-xs text-muted-foreground line-through">{formatPrice(p.price)}</p>
          </div>
        ) : (
          <p className="text-sm font-medium text-foreground">{formatPrice(p.price)}</p>
        ),
    },
    {
      header: 'Kho',
      accessor: 'stock',
      sortable: true,
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => {
        const lowStock = p.stock <= 5
        const outOfStock = p.stock <= 0
        return (
          <span
            className={`text-sm font-medium ${
              outOfStock
                ? 'text-destructive'
                : lowStock
                  ? 'text-warning'
                  : 'text-foreground'
            }`}
          >
            {p.stock}
          </span>
        )
      },
    },
    {
      header: 'Danh mục',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => {
        const categoryName =
          typeof p.categoryId === 'object' && p.categoryId !== null
            ? (p.categoryId as { name: string }).name
            : 'N/A'
        return <span className="text-sm text-muted-foreground">{categoryName}</span>
      },
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (p) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge variant={p.isActive ? 'active' : 'inactive'} />
          {p.isFeatured && (
            <Badge variant="secondary" className="bg-warning-light text-warning border-none">
              Nổi bật
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={toggleActiveMutation.isPending}
            onClick={() => toggleActiveMutation.mutate(p)}
            title={p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
          >
            {p.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={toggleFeaturedMutation.isPending}
            onClick={() => toggleFeaturedMutation.mutate(p)}
            title={p.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
            className={p.isFeatured ? 'text-warning hover:text-warning' : ''}
          >
            <Star size={16} className={p.isFeatured ? 'fill-warning text-warning' : ''} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={deleteMutation.isPending}
            onClick={() => setDeleteTargetId(p._id)}
            title="Xóa"
            className="text-destructive hover:text-destructive"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý sản phẩm" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
              <Package className="size-7 text-destructive" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">Có lỗi xảy ra</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý sản phẩm"
        description={`Tổng: ${pagination.total} sản phẩm`}
        action={
          <Button onClick={() => navigate('/admin/products/create')}>
            <Plus size={18} />
            Thêm sản phẩm
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm sản phẩm..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            message="Không tìm thấy sản phẩm nào"
            description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có sản phẩm nào trong hệ thống'}
            action={
              <Button onClick={() => navigate('/admin/products/create')}>
                <Plus size={16} />
                Thêm sản phẩm đầu tiên
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={products} keyExtractor={(p) => p._id} />
        )}
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          total={pagination.total}
        />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="sản phẩm"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
      />
    </div>
  )
}
