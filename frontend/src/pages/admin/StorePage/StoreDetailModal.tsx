import { X, Calendar, User, Phone, Mail, Star, ShieldCheck, CheckCircle, XCircle } from 'lucide-react'

interface Store {
  _id: string
  name: string
  slug: string
  logo?: string
  ownerId: string
  phone?: string
  email?: string
  description?: string
  isVerified: boolean
  isActive: boolean
  ratingsAverage: number
  ratingsQuantity: number
  followersCount: number
  createdAt: string
}

interface StoreDetailModalProps {
  show: boolean
  store: Store | null
  onClose: () => void
}

export default function StoreDetailModal({ show, store, onClose }: StoreDetailModalProps) {
  if (!show || !store) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết cửa hàng</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Logo & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShieldCheck size={24} className="text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                {store.name}
                {store.isVerified && (
                  <span className="inline-flex text-blue-500" title="Đã xác minh">
                    <ShieldCheck size={16} className="fill-blue-500 text-white" />
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-500">Slug: {store.slug}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả cửa hàng</span>
            <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[50px]">
              {store.description || 'Chưa có thông tin mô tả cửa hàng.'}
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Thông tin liên hệ</span>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{store.phone || 'Chưa cập nhật số điện thoại'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span className="truncate">{store.email || 'Chưa cập nhật email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
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
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Đánh giá</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-sm font-semibold text-amber-600">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                {store.ratingsAverage.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Lượt đánh giá</span>
              <p className="mt-1 text-sm font-semibold text-gray-900">{store.ratingsQuantity}</p>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Người theo dõi</span>
              <p className="mt-1 text-sm font-semibold text-gray-900">{store.followersCount}</p>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase mb-1">Trạng thái hoạt động</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                store.isActive ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'
              }`}>
                {store.isActive ? <CheckCircle size={10} className="text-green-500" /> : <XCircle size={10} className="text-red-500" />}
                {store.isActive ? 'Hoạt động' : 'Đang khóa'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <div>
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Ngày tham gia</span>
                <span>{new Date(store.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
