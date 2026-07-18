import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, User, CreditCard, Truck, CheckCircle, Send, Ship } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IOrder } from '@/types/order.types'
import {
  LoadingState,
  DetailCard,
  DetailField,
  StatusBadge,
} from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

const paymentMethodLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  e_wallet: 'Ví điện tử',
}

function actionLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Xác nhận đơn hàng'
    case 'confirmed': return 'Tiến hành giao hàng'
    case 'processing': return 'Tiến hành giao hàng'
    case 'shipping': return 'Xác nhận đã giao'
    default: return ''
  }
}

function nextStatus(status: string): string | null {
  switch (status) {
    case 'pending': return 'confirmed'
    case 'confirmed': return 'shipping'
    case 'processing': return 'shipping'
    case 'shipping': return 'delivered'
    default: return null
  }
}

function ActionIcon({ status }: { status: string }) {
  switch (status) {
    case 'pending': return <CheckCircle size={16} />
    case 'confirmed':
    case 'processing': return <Send size={16} />
    case 'shipping': return <Ship size={16} />
    default: return null
  }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery<IOrder>({
    queryKey: ['admin-order-detail', id],
    queryFn: () => adminService.getOrderById(id || ''),
    enabled: !!id,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-order-detail', id] })
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  }

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => adminService.updateOrderStatus(id!, status),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  if (isLoading) return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive-light">
          <Package size={32} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy đơn hàng</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Đã có lỗi xảy ra hoặc đơn hàng không tồn tại.
        </p>
        <Button onClick={() => navigate('/admin/orders')} className="mt-4">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const userInfo = typeof order.userId === 'object' ? order.userId : null
  const next = nextStatus(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{order.orderCode}</h1>
              <StatusBadge variant={orderStatusVariant[order.status]} label={statusLabels[order.status]} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ngày tạo: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        {next && (
          <Button
            onClick={() => updateStatusMutation.mutate(next)}
            disabled={updateStatusMutation.isPending}
          >
            <ActionIcon status={order.status} />
            {actionLabel(order.status)}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetailCard title="Thông tin đơn hàng" icon={Package}>
            <DetailField label="Mã đơn hàng" value={order.orderCode} mono />
            <DetailField label="Trạng thái" value={<StatusBadge variant={orderStatusVariant[order.status]} label={statusLabels[order.status]} />} />
            <DetailField label="Ngày tạo" value={formatDate(order.createdAt)} />
            {order.confirmedAt && <DetailField label="Xác nhận lúc" value={formatDate(order.confirmedAt)} />}
            {order.shippedAt && <DetailField label="Giao hàng lúc" value={formatDate(order.shippedAt)} />}
            {order.deliveredAt && <DetailField label="Hoàn thành lúc" value={formatDate(order.deliveredAt)} />}
            {order.cancelledAt && <DetailField label="Hủy lúc" value={formatDate(order.cancelledAt)} />}
            {order.cancelReason && <DetailField label="Lý do hủy" value={order.cancelReason} />}
            {order.note && <DetailField label="Ghi chú" value={order.note} />}
          </DetailCard>

          <DetailCard title="Thông tin khách hàng" icon={User}>
            <DetailField label="Tên" value={userInfo?.name || 'N/A'} />
            <DetailField label="Email" value={userInfo?.email || 'N/A'} />
            <DetailField label="Số điện thoại" value={userInfo?.phone || 'N/A'} />
            <DetailField
              label="Địa chỉ"
              value={`${order.shippingAddress.streetAddress}, ${order.shippingAddress.wardName}, ${order.shippingAddress.districtName}, ${order.shippingAddress.provinceName}`}
            />
          </DetailCard>

          <DetailCard title="Sản phẩm" icon={Package}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Sản phẩm</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="size-full object-cover" />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <Package size={16} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-foreground">
                        {formatPrice(item.discountPrice ?? item.price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-foreground">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-medium text-foreground">{formatPrice(item.subtotal)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 space-y-1 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="text-foreground">{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-destructive">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold">
                <span className="text-foreground">Tổng cộng</span>
                <span className="text-foreground">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Thanh toán" icon={CreditCard}>
            <DetailField
              label="Phương thức"
              value={paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
            />
            <DetailField
              label="Trạng thái"
              value={
                <StatusBadge variant={paymentStatusVariant[order.paymentStatus]} label={paymentLabels[order.paymentStatus]} />
              }
            />
            {order.transactionId && (
              <DetailField label="Mã giao dịch" value={order.transactionId} mono />
            )}
          </DetailCard>

          <DetailCard title="Vận chuyển" icon={Truck}>
            <DetailField
              label="Người nhận"
              value={order.shippingAddress.receiverName}
            />
            <DetailField
              label="Số điện thoại"
              value={order.shippingAddress.receiverPhone}
            />
            <DetailField
              label="Địa chỉ"
              value={`${order.shippingAddress.streetAddress}, ${order.shippingAddress.wardName}, ${order.shippingAddress.districtName}, ${order.shippingAddress.provinceName}`}
            />
            <DetailField label="Phí vận chuyển" value={formatPrice(order.shippingFee)} />
            {order.shippingCarrier && (
              <DetailField label="Đơn vị vận chuyển" value={order.shippingCarrier} />
            )}
            {order.shippingTrackingNumber && (
              <DetailField label="Mã vận đơn" value={order.shippingTrackingNumber} mono />
            )}
          </DetailCard>

          <DetailCard title="Mã giảm giá" icon={Package}>
            {order.voucherCode ? (
              <>
                <DetailField label="Mã" value={order.voucherCode} mono />
                <DetailField label="Giảm" value={formatPrice(order.discountAmount)} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Không sử dụng mã giảm giá</p>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  )
}
