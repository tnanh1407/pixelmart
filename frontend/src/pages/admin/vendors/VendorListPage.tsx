import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, CheckCircle, XCircle, AlertTriangle, Clock, Users, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { VendorListResponse, VendorStats, IVendor } from '@/types/vendor.types'
import {
  PageHeader,
  SearchToolbar,
  DataTable,
  Pagination,
  LoadingState,
  EmptyState,
  ConfirmDialog,
  StatusBadge,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

const statusFilters: { label: string; value: VendorStatus | '' }[] = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
  { label: 'Đình chỉ', value: 'suspended' },
]

const statCards = [
  { key: 'total', label: 'Tổng số', color: 'bg-primary/10 text-primary' },
  { key: 'approved', label: 'Đã duyệt', color: 'bg-success-light text-success' },
  { key: 'pending', label: 'Chờ duyệt', color: 'bg-warning-light text-warning' },
  { key: 'rejected', label: 'Từ chối', color: 'bg-destructive-light text-destructive' },
  { key: 'suspended', label: 'Đình chỉ', color: 'bg-destructive-light text-destructive' },
] as const

export default function VendorListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<VendorStatus | ''>('')

  const [actionTarget, setActionTarget] = useState<IVendor | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | null>(null)
  const [reasonInput, setReasonInput] = useState('')

  const queryParams: Record<string, unknown> = { page, limit: 10 }
  if (search) queryParams.search = search
  if (statusFilter) queryParams.status = statusFilter

  const { data, isLoading, isError, refetch } = useQuery<VendorListResponse>({
    queryKey: ['admin-vendors', page, search, statusFilter],
    queryFn: () => adminService.getVendors(queryParams),
    staleTime: 30 * 1000,
  })

  const { data: stats, isLoading: statsLoading } = useQuery<VendorStats>({
    queryKey: ['admin-vendor-stats'],
    queryFn: () => adminService.getVendorStats(),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveVendor(id),
    onSuccess: () => { invalidate(); toast.success('Đã duyệt vendor thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.rejectVendor(id, reason),
    onSuccess: () => { invalidate(); toast.success('Đã từ chối vendor') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.suspendVendor(id, reason),
    onSuccess: () => { invalidate(); toast.success('Đã đình chỉ vendor') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const vendors = data?.vendors || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const getOwnerName = (v: IVendor) => {
    if (typeof v.userId === 'object' && v.userId !== null) {
      return (v.userId as { name: string }).name
    }
    return 'N/A'
  }

  const getOwnerEmail = (v: IVendor) => {
    if (typeof v.userId === 'object' && v.userId !== null) {
      return (v.userId as { email: string }).email
    }
    return v.email || 'N/A'
  }

  const handleAction = () => {
    if (!actionTarget || !actionType) return
    const id = actionTarget._id

    if (actionType === 'approve') {
      approveMutation.mutate(id, { onSettled: () => resetAction() })
    } else if (actionType === 'reject') {
      rejectMutation.mutate({ id, reason: reasonInput }, { onSettled: () => resetAction() })
    } else if (actionType === 'suspend') {
      suspendMutation.mutate({ id, reason: reasonInput }, { onSettled: () => resetAction() })
    }
  }

  const resetAction = () => {
    setActionTarget(null)
    setActionType(null)
    setReasonInput('')
  }

  const isActionPending = approveMutation.isPending || rejectMutation.isPending || suspendMutation.isPending

  const columns: Column<IVendor>[] = [
    {
      header: 'Cửa hàng',
      cellClassName: 'py-3 px-4',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(`/admin/vendors/${v._id}`)}
            className="size-10 rounded-lg overflow-hidden shrink-0 bg-muted border border-border cursor-pointer hover:opacity-85 transition-opacity"
          >
            {v.avatar ? (
              <img src={v.avatar} alt={v.shopName} className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center">
                <Store size={18} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p
              onClick={() => navigate(`/admin/vendors/${v._id}`)}
              className="font-medium text-foreground text-sm cursor-pointer hover:text-primary transition-colors"
            >
              {v.shopName}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Chủ sở hữu',
      cellClassName: 'py-3 px-4 text-sm',
      render: (v) => <span className="text-foreground">{getOwnerName(v)}</span>,
    },
    {
      header: 'Email',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: (v) => getOwnerEmail(v),
    },
    {
      header: 'Trạng thái',
      cellClassName: 'py-3 px-4',
      render: (v) => <StatusBadge variant={v.status as VendorStatus} />,
    },
    {
      header: 'Sản phẩm',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: () => 'N/A',
    },
    {
      header: 'Ngày tạo',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: (v) => new Date(v.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'py-3 px-4 text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          {v.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => { setActionTarget(v); setActionType('approve') }}
                title="Duyệt"
                className="text-success hover:text-success hover:bg-success-light"
              >
                <CheckCircle size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => { setActionTarget(v); setActionType('reject'); setReasonInput('') }}
                title="Từ chối"
                className="text-destructive hover:text-destructive hover:bg-destructive-light"
              >
                <XCircle size={16} />
              </Button>
            </>
          )}
          {v.status === 'approved' && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => { setActionTarget(v); setActionType('suspend'); setReasonInput('') }}
              title="Đình chỉ"
              className="text-destructive hover:text-destructive hover:bg-destructive-light"
            >
              <AlertTriangle size={16} />
            </Button>
          )}
          {v.status === 'suspended' && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => { setActionTarget(v); setActionType('approve') }}
              title="Kích hoạt lại"
              className="text-success hover:text-success hover:bg-success-light"
            >
              <CheckCircle size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/admin/vendors/${v._id}`)}
            title="Chi tiết"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Quản lý Vendor"
        description={`Tổng: ${pagination.total} vendor`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map(({ key, label, color }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color} inline-block px-2 py-0.5 rounded-md`}>
              {statsLoading ? '...' : (stats?.[key as keyof VendorStats] ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchToolbar
            placeholder="Tìm kiếm vendor..."
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                statusFilter === value
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
                <Store className="size-7 text-destructive" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Có lỗi xảy ra</h3>
              <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">Không thể tải danh sách vendor. Vui lòng thử lại sau.</p>
              <Button variant="outline" onClick={() => refetch()}>Thử lại</Button>
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <EmptyState
            icon={Users}
            message="Không tìm thấy vendor nào"
            description={search || statusFilter ? 'Thử thay đổi bộ lọc tìm kiếm' : 'Chưa có vendor nào trong hệ thống'}
          />
        ) : (
          <DataTable columns={columns} data={vendors} keyExtractor={(v) => v._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <ConfirmDialog
        open={actionType === 'approve'}
        onOpenChange={(open) => { if (!open) resetAction() }}
        title={actionTarget?.status === 'suspended' ? 'Kích hoạt lại vendor?' : 'Duyệt vendor?'}
        description={`Bạn có chắc chắn muốn ${actionTarget?.status === 'suspended' ? 'kích hoạt lại' : 'duyệt'} vendor "${actionTarget?.shopName}"?`}
        onConfirm={handleAction}
        confirmLabel="Xác nhận"
      />

      <Dialog open={actionType === 'reject' || actionType === 'suspend'} onOpenChange={(open) => { if (!open) resetAction() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'reject' ? 'Từ chối vendor' : 'Đình chỉ vendor'}</DialogTitle>
            <DialogDescription>
              {actionType === 'reject'
                ? `Nhập lý do từ chối vendor "${actionTarget?.shopName}"`
                : `Nhập lý do đình chỉ vendor "${actionTarget?.shopName}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="reason">Lý do</Label>
            <Input
              id="reason"
              placeholder="Nhập lý do..."
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAction}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={handleAction}
              disabled={!reasonInput.trim() || isActionPending}
            >
              {actionType === 'reject' ? 'Từ chối' : 'Đình chỉ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
