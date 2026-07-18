import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Store, Phone, Mail, MapPin, Star, Calendar, Edit, ShieldCheck, User, Info,
} from 'lucide-react'
import { storeService } from '@/services/user/store.service'
import type { IStore } from '@/types/store.types'
import { StatusBadge, LoadingState, DetailCard, DetailField, StatusToggle } from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: store, isLoading, error } = useQuery<IStore>({
    queryKey: ['admin-store-detail', id],
    queryFn: () => storeService.getStoreById(id || ''),
    enabled: !!id,
  })

  const formatDate = (date?: string) => {
    if (!date) return '\u2014'
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  if (isLoading) return <LoadingState className="min-h-[400px]" />

  if (error || !store) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
        <Store size={48} className="mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy cửa hàng</h3>
        <p className="text-muted-foreground mt-1">Đã có lỗi xảy ra hoặc cửa hàng không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/stores')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/stores')}
            className="p-2 bg-card hover:bg-muted rounded-lg border border-border shadow-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
              <StatusBadge active={store.isActive} />
              {store.isVerified && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-none flex items-center gap-1">
                  <ShieldCheck size={12} className="fill-blue-700 text-white" />
                  Đã xác minh
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">ID: {store._id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/stores/${store._id}/edit`)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Edit size={16} /> Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailCard title="Thông tin cơ bản" icon={Info}>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-20 bg-muted rounded-xl overflow-hidden border border-border shrink-0">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Store size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{store.name}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Slug: {store.slug}</p>
              </div>
            </div>
            <DetailField label="Tên cửa hàng" value={store.name} />
            <DetailField label="Slug" value={store.slug} mono />
            <DetailField
              label="Mô tả"
              value={store.description || 'Chưa có thông tin mô tả'}
            />
          </DetailCard>

          <DetailCard title="Thông tin liên hệ" icon={Phone}>
            <DetailField
              label="Email"
              value={store.email || 'Chưa cập nhật'}
            />
            <DetailField
              label="Số điện thoại"
              value={store.phone || 'Chưa cập nhật'}
            />
            <DetailField
              label="Chủ sở hữu"
              value={typeof store.ownerId === 'object' && store.ownerId !== null
                ? `${(store.ownerId as any).name} (${(store.ownerId as any).email})`
                : store.ownerId
              }
            />
          </DetailCard>

          <DetailCard title="Địa chỉ" icon={MapPin}>
            {store.address ? (
              <>
                <DetailField label="Thành phố" value={store.address.city || 'N/A'} />
                <DetailField label="Quận/Huyện" value={store.address.district || 'N/A'} />
                <DetailField label="Phường/Xã" value={store.address.ward || 'N/A'} />
                <DetailField label="Đường/Số nhà" value={store.address.street || 'N/A'} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có thông tin địa chỉ</p>
            )}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Đánh giá" icon={Star}>
            <DetailField
              label="Điểm trung bình"
              value={
                <span className="flex items-center gap-1 text-amber-600">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  {store.ratingsAverage.toFixed(1)}
                </span>
              }
            />
            <DetailField label="Lượt đánh giá" value={store.ratingsQuantity} />
            <DetailField label="Người theo dõi" value={store.followersCount ?? 0} />
          </DetailCard>

          <DetailCard title="Trạng thái" icon={ShieldCheck}>
            <DetailField
              label="Hoạt động"
              value={<StatusBadge active={store.isActive} />}
            />
            <DetailField
              label="Xác minh"
              value={
                store.isVerified
                  ? <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-none">Đã xác minh</Badge>
                  : <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">Chưa xác minh</Badge>
              }
            />
          </DetailCard>

          <DetailCard title="Thời gian" icon={Calendar}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(store.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(store.updatedAt)}</p>
                </div>
              </div>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  )
}
