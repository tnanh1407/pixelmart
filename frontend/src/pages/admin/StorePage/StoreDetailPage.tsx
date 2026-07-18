import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Calendar, User, Phone, Mail, Star, ShieldCheck, Loader2, Edit } from 'lucide-react'
import { storeService } from '@/services/store.service'
import { useAdminStoreMutations } from '@/hooks/admin/stores'
import { Badge } from '@/components/ui/badge'
import StoreFormModal from './StoreFormModal'
import type { AdminStoreForm } from '@/hooks/admin/stores'

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<AdminStoreForm>({
    name: '', logo: '', description: '', phone: '', email: '',
    address: { street: '', ward: '', district: '', city: '' },
    isVerified: false, isActive: true, ownerId: '',
  })

  const { data: store, isLoading, error } = useQuery({
    queryKey: ['admin-store-detail', id],
    queryFn: () => storeService.getStoreById(id || ''),
    enabled: !!id,
  })

  const { updateStoreMutation } = useAdminStoreMutations({
    onSaved: () => setShowModal(false),
  })

  const openEdit = () => {
    if (!store) return
    setForm({
      name: store.name || '',
      logo: store.logo || '',
      description: store.description || '',
      phone: store.phone || '',
      email: store.email || '',
      address: {
        street: store.address?.street || '',
        ward: store.address?.ward || '',
        district: store.address?.district || '',
        city: store.address?.city || '',
      },
      isVerified: store.isVerified || false,
      isActive: store.isActive !== undefined ? store.isActive : true,
      ownerId: typeof store.ownerId === 'object' && store.ownerId !== null ? store.ownerId._id : (store.ownerId || ''),
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.ownerId) return

    const cleanOwnerId =
      typeof form.ownerId === 'object' && form.ownerId !== null
        ? (form.ownerId as any)._id
        : form.ownerId

    const cleanForm = { ...form, ownerId: cleanOwnerId }
    updateStoreMutation.mutate({ id: id || '', payload: cleanForm })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <ShieldCheck size={48} className="mx-auto text-text-muted mb-3" />
        <h3 className="text-lg font-semibold text-text">Không tìm thấy cửa hàng</h3>
        <p className="text-text-muted mt-1">Đã có lỗi xảy ra hoặc cửa hàng không tồn tại.</p>
        <button onClick={() => navigate('/admin/stores')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/stores')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-text-muted hover:text-text transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{store.name}</h1>
              <Badge
                variant={store.isActive ? 'default' : 'destructive'}
                className={`px-3 py-1 text-xs font-semibold shadow-none border-none ${
                  store.isActive ? 'bg-green-500/10 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {store.isActive ? 'Đang hoạt động' : 'Đang ẩn'}
              </Badge>
            </div>
            <p className="text-sm text-text-muted mt-1">ID: {store._id}</p>
          </div>
        </div>
        <button onClick={openEdit}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm cursor-pointer">
          <Edit size={16} />
          Chỉnh sửa cửa hàng
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="p-6 space-y-6">
          {/* Logo & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShieldCheck size={32} className="text-text-muted" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-bold text-text flex items-center gap-2">
                {store.name}
                {store.isVerified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 py-0.5 px-2">
                    <ShieldCheck size={12} className="fill-white text-blue-500" />
                    Đã xác minh
                  </Badge>
                )}
              </h4>
              <p className="text-sm text-text-muted mt-0.5">Slug: {store.slug}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Mô tả cửa hàng</span>
            <p className="text-sm text-text mt-1 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[60px]">
              {store.description || 'Chưa có thông tin mô tả cửa hàng.'}
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Thông tin liên hệ</span>
            <div className="grid grid-cols-1 gap-3 text-sm text-text bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-text-muted" />
                <span>{store.phone || 'Chưa cập nhật số điện thoại'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-text-muted" />
                <span className="truncate">{store.email || 'Chưa cập nhật email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted font-mono">
                  Chủ sở hữu:{' '}
                  {typeof store.ownerId === 'object' && store.ownerId !== null
                    ? `${store.ownerId.name} (${store.ownerId.email})`
                    : store.ownerId}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-text-muted font-semibold block uppercase">Đánh giá</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-base font-bold text-amber-600">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {store.ratingsAverage.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-text-muted font-semibold block uppercase">Lượt đánh giá</span>
              <p className="mt-1 text-base font-bold text-text">{store.ratingsQuantity}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-text-muted font-semibold block uppercase">Người theo dõi</span>
              <p className="mt-1 text-base font-bold text-text">{store.followersCount}</p>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-6 text-sm text-text-muted">
            <div>
              <span className="block text-[10px] text-text-muted font-semibold uppercase mb-1">Trạng thái hoạt động</span>
              <Badge
                variant={store.isActive ? 'default' : 'destructive'}
                className={`px-3 py-1 text-xs font-semibold shadow-none border-none ${
                  store.isActive ? 'bg-green-500/10 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {store.isActive ? 'Hoạt động' : 'Đang khóa'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-text-muted" />
              <div>
                <span className="block text-[10px] text-text-muted font-semibold uppercase">Ngày tham gia</span>
                <span>{new Date(store.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={() => navigate('/admin/stores')}
            className="px-4 py-2 text-sm font-medium text-text bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm cursor-pointer">
            Quay lại
          </button>
        </div>
      </div>

      <StoreFormModal
        showModal={showModal}
        editingId={id || null}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)}
        isPending={updateStoreMutation.isPending}
      />
    </div>
  )
}
