import { useNavigate } from 'react-router-dom'
import { Package, Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Status maps ──────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderRow = {
  _id: string
  orderCode: string
  userId: string | { _id: string; name: string; email: string; phone?: string }
  storeId: string | { _id: string; name: string; slug: string; logo?: string; phone?: string }
  items: { quantity: number }[]
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
}

interface OrderTableProps {
  orders: OrderRow[]
  isLoading?: boolean
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-4 py-3"><Skeleton className="h-3.5 w-28" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-3.5 w-32" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-3.5 w-32" /></TableCell>
          <TableCell className="px-4 py-3 text-center"><Skeleton className="h-3.5 w-6 mx-auto" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-3.5 w-24" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
          <TableCell className="px-4 py-3"><Skeleton className="h-3.5 w-28" /></TableCell>
          <TableCell className="px-4 py-3 text-right"><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Empty ────────────────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={9} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Package size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy đơn hàng nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrderTable({ orders, isLoading = false }: OrderTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-left">Mã đơn hàng</TableHead>
          <TableHead className="px-4 text-left">Khách hàng</TableHead>
          <TableHead className="px-4 text-left">Cửa hàng</TableHead>
          <TableHead className="px-4 text-center">SL</TableHead>
          <TableHead className="px-4 text-left">Tổng tiền</TableHead>
          <TableHead className="px-4 text-left">Trạng thái</TableHead>
          <TableHead className="px-4 text-left">Thanh toán</TableHead>
          <TableHead className="px-4 text-left">Ngày tạo</TableHead>
          <TableHead className="px-4 text-right" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : orders.length === 0 ? (
          <EmptyRow />
        ) : (
          orders.map((order) => {
            const user = typeof order.userId === 'object' ? order.userId : null
            const store = typeof order.storeId === 'object' ? order.storeId : null
            const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <TableRow key={order._id} className="group">
                {/* Mã đơn hàng */}
                <TableCell className="px-4 py-3">
                  <span
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="cursor-pointer text-sm font-medium text-primary hover:underline"
                  >
                    {order.orderCode}
                  </span>
                </TableCell>

                {/* Khách hàng */}
                <TableCell className="px-4 py-3">
                  <span className="text-sm text-foreground">{user ? user.name : 'N/A'}</span>
                </TableCell>

                {/* Cửa hàng */}
                <TableCell className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{store ? store.name : 'N/A'}</span>
                </TableCell>

                {/* SL */}
                <TableCell className="px-4 py-3 text-center">
                  <span className="text-sm text-foreground">{quantity}</span>
                </TableCell>

                {/* Tổng tiền */}
                <TableCell className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{formatPrice(order.totalAmount)}</span>
                </TableCell>

                {/* Trạng thái */}
                <TableCell className="px-4 py-3">
                  <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(orderStatusVariant[order.status]))}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>

                {/* Thanh toán */}
                <TableCell className="px-4 py-3">
                  <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(paymentStatusVariant[order.paymentStatus]))}>
                    {paymentLabels[order.paymentStatus]}
                  </Badge>
                </TableCell>

                {/* Ngày tạo */}
                <TableCell className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                </TableCell>

                {/* Thao tác */}
                <TableCell className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
