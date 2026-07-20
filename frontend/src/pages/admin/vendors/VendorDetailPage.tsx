import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ArrowLeft, Store, Phone, Mail, Info, Building2, CreditCard, BadgeCheck,
  Calendar, CheckCircle, XCircle, AlertTriangle, Hash, User,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IVendor, VendorStatus } from '@/types/vendor.types'
import {
  LoadingState,
  DetailCard,
  DetailField,
  ConfirmDialog,
} from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'
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

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | null>(null)
  const [reasonInput, setReasonInput] = useState('')

  const { data: vendor, isLoading, error } = useQuery<IVendor>({
    queryKey: ['admin-vendor-detail', id],
    queryFn: () => adminService.getVendorById(id || ''),
    enabled: !!id,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-vendor-detail', id] })

  const approveMutation = useMutation({
    mutationFn: () => adminService.approveVendor(id!),
    onSuccess: () => { invalidate(); toast.success('Đã duyệt vendor thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => adminService.rejectVendor(id!, reason),
    onSuccess: () => { invalidate(); toast.success('Đã từ chối vendor') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const suspendMutation = useMutation({
    mutationFn: (reason: string) => adminService.suspendVendor(id!, reason),
    onSuccess: () => { invalidate(); toast.success('Đã đình chỉ vendor') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const isActionPending = approveMutation.isPending || rejectMutation.isPending || suspendMutation.isPending

  const handleAction = () => {
    if (!actionType) return
    if (actionType === 'approve') {
      approveMutation.mutate(undefined, { onSettled: () => setActionType(null) })
    } else if (actionType === 'reject') {
      rejectMutation.mutate(reasonInput, { onSettled: () => { setActionType(null); setReasonInput('') } })
    } else if (actionType === 'suspend') {
      suspendMutation.mutate(reasonInput, { onSettled: () => { setActionType(null); setReasonInput('') } })
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  if (isLoading) return <LoadingState className="min-h-[400px]" />

  if (error || !vendor) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
        <Store size={48} className="mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy vendor</h3>
        <p className="text-muted-foreground mt-1">Đã có lỗi xảy ra hoặc vendor không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/vendors')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  const name = typeof vendor.userId === 'object' ? (vendor.userId as { name: string }).name : 'N/A'
  const email = typeof vendor.userId === 'object' ? (vendor.userId as { email: string }).email : vendor.email || 'N/A'

  const statusTimeline = [
    { status: 'pending' as const, label: 'Tạo yêu cầu', date: vendor.createdAt, done: true },
    { status: 'approved' as const, label: 'Đã duyệt', date: vendor.verifiedAt, done: vendor.status === 'approved' },
    { status: 'rejected' as const, label: 'Từ chối', date: undefined, done: vendor.status === 'rejected' },
    { status: 'suspended' as const, label: 'Đình chỉ', date: undefined, done: vendor.status === 'suspended' },
  ]

  const getConfirmTitle = () => {
    switch (actionType) {
      case 'approve': return vendor.status === 'suspended' ? 'Kích hoạt lại vendor?' : 'Duyệt vendor?'
      case 'reject': return 'Từ chối vendor?'
      case 'suspend': return 'Đình chỉ vendor?'
      default: return ''
    }
  }

  const getConfirmDescription = () => {
    const name = vendor.shopName
    switch (actionType) {
      case 'approve': return vendor.status === 'suspended'
        ? `Bạn có chắc chắn muốn kích hoạt lại vendor "${name}"?`
        : `Bạn có chắc chắn muốn duyệt vendor "${name}"?`
      case 'reject': return `Bạn có chắc chắn muốn từ chối vendor "${name}"?`
      case 'suspend': return `Bạn có chắc chắn muốn đình chỉ vendor "${name}"?`
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/vendors')}
            className="p-2 bg-card hover:bg-muted rounded-lg border border-border shadow-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{vendor.shopName}</h1>
              <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(vendor.status))} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">ID: {vendor._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {vendor.status === 'pending' && (
            <>
              <Button
                onClick={() => setActionType('approve')}
                className="bg-success text-white hover:bg-success/90"
              >
                <CheckCircle size={16} /> Duyệt
              </Button>
              <Button
                variant="outline"
                onClick={() => setActionType('reject')}
                className="text-destructive border-destructive/30 hover:bg-destructive-light"
              >
                <XCircle size={16} /> Từ chối
              </Button>
            </>
          )}
          {vendor.status === 'approved' && (
            <Button
              variant="outline"
              onClick={() => setActionType('suspend')}
              className="text-destructive border-destructive/30 hover:bg-destructive-light"
            >
              <AlertTriangle size={16} /> Đình chỉ
            </Button>
          )}
          {vendor.status === 'suspended' && (
            <Button
              onClick={() => setActionType('approve')}
              className="bg-success text-white hover:bg-success/90"
            >
              <CheckCircle size={16} /> Kích hoạt lại
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailCard title="Thông tin cửa hàng" icon={Store}>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-20 bg-muted rounded-xl overflow-hidden border border-border shrink-0">
                {vendor.avatar ? (
                  <img src={vendor.avatar} alt={vendor.shopName} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Store size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{vendor.shopName}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {vendor.businessName || 'Chưa có tên doanh nghiệp'}
                </p>
              </div>
            </div>
            <DetailField label="Tên cửa hàng" value={vendor.shopName} />
            <DetailField label="Tên doanh nghiệp" value={vendor.businessName || 'Chưa cập nhật'} />
            <DetailField label="Mô tả" value={vendor.description || 'Chưa có mô tả'} />
          </DetailCard>

          <DetailCard title="Thông tin liên hệ" icon={Phone}>
            <DetailField label="Email" value={email} />
            <DetailField label="Số điện thoại" value={vendor.phone || 'Chưa cập nhật'} />
            <DetailField label="Chủ sở hữu" value={name} />
          </DetailCard>

          <DetailCard title="Thông tin nhận dạng" icon={BadgeCheck}>
            <DetailField label="Mã số thuế" value={vendor.taxCode || 'Chưa cập nhật'} mono />
            <DetailField label="Số CMND/CCCD" value={(vendor as any).identityNumber || 'Chưa cập nhật'} mono />
          </DetailCard>

          <DetailCard title="Thông tin ngân hàng" icon={CreditCard}>
            <DetailField label="Ngân hàng" value={vendor.bankName || 'Chưa cập nhật'} />
            <DetailField label="Số tài khoản" value={vendor.bankAccountNumber || 'Chưa cập nhật'} mono />
            <DetailField label="Chủ tài khoản" value={vendor.bankAccountHolder || 'Chưa cập nhật'} />
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Trạng thái" icon={Info}>
            <div className="space-y-4">
              <DetailField
                label="Trạng thái hiện tại"
                value={<Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(vendor.status))} />}
              />
              {vendor.rejectionReason && (
                <DetailField
                  label="Lý do từ chối"
                  value={<span className="text-destructive">{vendor.rejectionReason}</span>}
                />
              )}
              {vendor.approvedBy && (
                <DetailField label="Người duyệt" value={vendor.approvedBy} />
              )}
            </div>
          </DetailCard>

          <DetailCard title="Dòng thời gian" icon={Calendar}>
            <div className="space-y-4">
              {statusTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`size-2 rounded-full mt-1.5 shrink-0 ${
                    item.done ? 'bg-success' : 'bg-muted'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </p>
                    {item.date && (
                      <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>

          <DetailCard title="Thời gian" icon={Calendar}>
            <DetailField label="Ngày tạo" value={formatDate(vendor.createdAt)} />
            <DetailField label="Cập nhật" value={formatDate(vendor.updatedAt)} />
            {vendor.verifiedAt && (
              <DetailField label="Xác minh" value={formatDate(vendor.verifiedAt)} />
            )}
          </DetailCard>
        </div>
      </div>

      <ConfirmDialog
        open={actionType === 'approve'}
        onOpenChange={(open) => { if (!open) setActionType(null) }}
        title={getConfirmTitle()}
        description={getConfirmDescription()}
        onConfirm={handleAction}
        confirmLabel="Xác nhận"
      />

      <Dialog open={actionType === 'reject' || actionType === 'suspend'} onOpenChange={(open) => { if (!open) { setActionType(null); setReasonInput('') } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'reject' ? 'Từ chối vendor' : 'Đình chỉ vendor'}</DialogTitle>
            <DialogDescription>
              {actionType === 'reject'
                ? `Nhập lý do từ chối vendor "${vendor?.shopName}"`
                : `Nhập lý do đình chỉ vendor "${vendor?.shopName}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="detail-reason">Lý do</Label>
            <Input
              id="detail-reason"
              placeholder="Nhập lý do..."
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionType(null); setReasonInput('') }}>Hủy</Button>
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
