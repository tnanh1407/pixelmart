import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Tag } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { VoucherListResponse } from '@/types/voucher.types'
import type { IVoucher } from '@/types/voucher.types'
import { useAdminVoucherMutations } from '@/hooks/admin/vouchers/useAdminVoucherMutations'
import {
  PageHeader,
  SearchToolbar,
  Pagination,
  LoadingState,
  EmptyState,
  ErrorState,
  DeleteDialog,
} from '@/components/admin/shared'
import VoucherTable from './VoucherTable'
import { Button } from '@/components/ui/button'

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

export default function VoucherListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { deleteMutation } = useAdminVoucherMutations()

  const { data, isLoading, isError, refetch } = useQuery<VoucherListResponse>({
    queryKey: ['admin-vouchers', page, search],
    queryFn: () => adminService.getVouchers({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const vouchers: IVoucher[] = data?.vouchers || []
  const pagination = data?.pagination || emptyPagination

  const columns: Column<IVoucher>[] = [
    {
      header: 'Mã',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (v) => (
        <code className="text-xs font-semibold bg-muted px-2 py-1 rounded text-foreground">
          {v.code}
        </code>
      ),
    },
    {
      header: 'Tên',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (v) => (
        <span className="text-sm font-medium text-foreground">{v.name}</span>
      ),
    },
    {
      header: 'Loại',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (v) => (
        <Badge variant="secondary" className="font-normal text-xs">
          {typeLabels[v.type] || v.type}
        </Badge>
      ),
    },
    {
      header: 'Giá trị',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-foreground font-medium',
      render: (v) => (
        v.type === 'percentage' ? `${v.value}%` : formatCurrency(v.value)
      ),
    },
    {
      header: 'Đơn tối thiểu',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (v) => formatCurrency(v.minOrderValue),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (v) => (
        <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(v.isActive ? 'active' : 'inactive'))} />
      ),
    },
    {
      header: 'Đã dùng',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (v) => (
        <span>{v.usedCount} / {v.usageLimit}</span>
      ),
    },
    {
      header: 'Phạm vi',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (v) => (
        <span>{scopeLabels[v.scope] || v.scope}</span>
      ),
    },
    {
      header: 'Thời gian',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (v) => (
        <span>{formatDate(v.startDate)} \u2013 {formatDate(v.endDate)}</span>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/vouchers/${v._id}/edit`)}
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetId(v._id)}
            disabled={deleteMutation.isPending}
            title="Xóa"
            className="text-destructive hover:text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý Voucher" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Voucher"
        description={`Tổng: ${pagination.total} voucher`}
        action={
          <Button onClick={() => navigate('/admin/vouchers/create')}>
            <Plus size={18} />
            Thêm Voucher
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm voucher..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : vouchers.length === 0 ? (
          <EmptyState
            icon={Tag}
            message="Không tìm thấy voucher nào"
            description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có voucher nào trong hệ thống'}
            action={
              <Button onClick={() => navigate('/admin/vouchers/create')}>
                <Plus size={16} />
                Thêm voucher đầu tiên
              </Button>
            }
          />
        ) : (
          <VoucherTable vouchers={vouchers} isLoading={false} onDelete={setDeleteTargetId} />
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
        entityLabel="voucher"
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
