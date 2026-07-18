import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Clock, CheckCircle, XCircle, Package, Eye } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { OrderListResponse, IOrder } from '@/types/order.types'
import {
  PageHeader,
  SearchToolbar,
  DataTable,
  Pagination,
  LoadingState,
  EmptyState,
  StatusBadge,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

const orderStatusVariant: Record<string, 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'> = {
  pending: 'pending',
  confirmed: 'confirmed',
  processing: 'confirmed',
  shipping: 'shipping',
  delivered: 'delivered',
  cancelled: 'cancelled',
}

const paymentStatusVariant: Record<string, 'paid' | 'unpaid' | 'refunded' | 'failed'> = {
  pending: 'unpaid',
  paid: 'paid',
  refunded: 'refunded',
  failed: 'failed',
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

const paymentLabels: Record<string, string> = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
  failed: 'Thất bại',
}

function StatCard({
  icon: Icon,
  label,
  value,
  bgClass,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: number
  bgClass: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
      <div className={`flex size-10 items-center justify-center rounded-lg ${bgClass}`}>
        <Icon size={20} className="text-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function OrderListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')

  const params = useMemo(() => {
    const p: Record<string, unknown> = { page, limit: 10 }
    if (search) p.search = search
    if (statusFilter) p.status = statusFilter
    if (paymentFilter) p.paymentStatus = paymentFilter
    return p
  }, [page, search, statusFilter, paymentFilter])

  const { data, isLoading, isError, refetch } = useQuery<OrderListResponse>({
    queryKey: ['admin-orders', params],
    queryFn: () => adminService.getOrders(params),
    staleTime: 30 * 1000,
  })

  const orders = data?.orders || []
  const pagination = data?.pagination || emptyPagination

  const stats = useMemo(() => ({
    pending: orders.filter((o) => o.status === 'pending').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }), [orders])

  const columns: Column<IOrder>[] = [
    {
      header: 'Mã đơn hàng',
      cellClassName: 'px-4',
      render: (o) => (
        <span
          onClick={() => navigate(`/admin/orders/${o._id}`)}
          className="cursor-pointer font-medium text-primary hover:underline"
        >
          {o.orderCode}
        </span>
      ),
    },
    {
      header: 'Khách hàng',
      cellClassName: 'px-4',
      render: (o) => {
        const user = typeof o.userId === 'object' ? o.userId : null
        return <span className="text-sm text-foreground">{user ? user.name : 'N/A'}</span>
      },
    },
    {
      header: 'Cửa hàng',
      cellClassName: 'px-4',
      render: (o) => {
        const store = typeof o.storeId === 'object' ? o.storeId : null
        return <span className="text-sm text-muted-foreground">{store ? store.name : 'N/A'}</span>
      },
    },
    {
      header: 'SL',
      cellClassName: 'px-4 text-center',
      render: (o) => (
        <span className="text-sm text-foreground">{o.items.reduce((s, i) => s + i.quantity, 0)}</span>
      ),
    },
    {
      header: 'Tổng tiền',
      cellClassName: 'px-4',
      render: (o) => (
        <span className="text-sm font-medium text-foreground">{formatPrice(o.totalAmount)}</span>
      ),
    },
    {
      header: 'Trạng thái',
      cellClassName: 'px-4',
      render: (o) => (
        <StatusBadge variant={orderStatusVariant[o.status]} label={statusLabels[o.status]} />
      ),
    },
    {
      header: 'Thanh toán',
      cellClassName: 'px-4',
      render: (o) => (
        <StatusBadge variant={paymentStatusVariant[o.paymentStatus]} label={paymentLabels[o.paymentStatus]} />
      ),
    },
    {
      header: 'Ngày tạo',
      cellClassName: 'px-4',
      render: (o) => (
        <span className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</span>
      ),
    },
    {
      header: '',
      cellClassName: 'px-4 text-right',
      render: (o) => (
        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/orders/${o._id}`)}>
          <Eye size={16} />
        </Button>
      ),
    },
  ]

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý đơn hàng" />
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
              <Package className="size-7 text-destructive" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">Có lỗi xảy ra</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
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
        title="Quản lý đơn hàng"
        description={`Tổng: ${pagination.total} đơn hàng`}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Tổng đơn" value={pagination.total} bgClass="bg-info-light" />
        <StatCard icon={Clock} label="Chờ xử lý" value={stats.pending} bgClass="bg-warning-light" />
        <StatCard icon={CheckCircle} label="Đã giao" value={stats.delivered} bgClass="bg-success-light" />
        <StatCard icon={XCircle} label="Đã hủy" value={stats.cancelled} bgClass="bg-destructive-light" />
      </div>

      <SearchToolbar
        placeholder="Tìm kiếm mã đơn hàng hoặc tên khách hàng..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
        filter={
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="pending">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            message="Không tìm thấy đơn hàng nào"
            description={
              search || statusFilter || paymentFilter
                ? 'Thử thay đổi điều kiện tìm kiếm'
                : 'Chưa có đơn hàng nào trong hệ thống'
            }
          />
        ) : (
          <DataTable columns={columns} data={orders} keyExtractor={(o) => o._id} />
        )}
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          total={pagination.total}
        />
      </div>
    </div>
  )
}
