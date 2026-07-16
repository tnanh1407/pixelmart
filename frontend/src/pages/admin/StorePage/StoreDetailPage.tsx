import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Calendar, User, Phone, Mail, Star, ShieldCheck, CheckCircle, XCircle, Loader2, Edit } from 'lucide-react'
import { storeService } from '@/services/store.service'
import { adminService } from '@/services/admin/admin.service'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import StoreFormModal from './StoreFormModal'

interface StoreForm {
  name: string
  logo?: string
  description?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  isVerified: boolean
  isActive: boolean
  ownerId: any
}

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Edit Modal States
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<StoreForm>({
    name: '',
    logo: '',
    description: '',
    phone: '',
    email: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
    },
    isVerified: false,
    isActive: true,
    ownerId: '',
  })

  const { data: store, isLoading, error } = useQuery({
    queryKey: ['admin-store-detail', id],
    queryFn: () => storeService.getStoreById(id || ''),
    enabled: !!id,
  })

  const updateStoreMutation = useMutation({
    mutationFn: (payload: StoreForm) =>
      adminService.updateStore(id || '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật cửa hàng thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
      setShowModal(false)
    },
    onError: (err: any) => {
      console.error(err)
      Swal.fire({
        title: 'Thất bại!',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật cửa hàng.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
    },
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
    if (!form.name.trim() || !form.ownerId) {
      toast.error('Vui lòng nhập đầy đủ tên cửa hàng và chọn chủ sở hữu')
      return
    }

    const cleanOwnerId =
      typeof form.ownerId === 'object' && form.ownerId !== null
        ? (form.ownerId as any)._id
        : form.ownerId

    const cleanForm = {
      ...form,
      ownerId: cleanOwnerId,
    }

    updateStoreMutation.mutate(cleanForm)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <ShieldCheck size={48} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy cửa hàng</h3>
        <p className="text-gray-500 mt-1">Đã có lỗi xảy ra hoặc cửa hàng không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/stores')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
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
          <button
            onClick={() => navigate('/admin/stores')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết cửa hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý và xem chi tiết hoạt động của cửa hàng</p>
          </div>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
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
                  <ShieldCheck size={32} className="text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {store.name}
                {store.isVerified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 py-0.5 px-2">
                    <ShieldCheck size={12} className="fill-white text-blue-500" />
                    Đã xác minh
                  </Badge>
                )}
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">Slug: {store.slug}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả cửa hàng</span>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[60px]">
              {store.description || 'Chưa có thông tin mô tả cửa hàng.'}
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Thông tin liên hệ</span>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{store.phone || 'Chưa cập nhật số điện thoại'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{store.email || 'Chưa cập nhật email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-mono">
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
              <span className="text-xs text-gray-400 font-semibold block uppercase">Đánh giá</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-base font-bold text-amber-600">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {store.ratingsAverage.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-400 font-semibold block uppercase">Lượt đánh giá</span>
              <p className="mt-1 text-base font-bold text-gray-900">{store.ratingsQuantity}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-400 font-semibold block uppercase">Người theo dõi</span>
              <p className="mt-1 text-base font-bold text-gray-900">{store.followersCount}</p>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-6 text-sm text-gray-500">
            <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase mb-1">Trạng thái hoạt động</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                store.isActive ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'
              }`}>
                {store.isActive ? <CheckCircle size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-500" />}
                {store.isActive ? 'Hoạt động' : 'Đang khóa'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Ngày tham gia</span>
                <span>{new Date(store.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => navigate('/admin/stores')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
          >
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
