import { useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import AvatarUpload from '@/components/AvatarUpload'
import useUserStore from '@/stores/useUserStore'

interface ProfileField {
  label: string
  value: string
  action?: string
  actionType?: 'change' | 'verify'
}

export default function ProfilePage() {
  const { user } = useUserStore()
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const profileFields: ProfileField[] = [
    { label: 'Tên tài khoản', value: user?.email?.split('@')[0] || 'N/A' },
    { label: 'Password', value: '••••••••••••', action: 'Thay đổi', actionType: 'change' },
    { label: 'Họ và tên', value: user?.name || 'N/A', action: 'Thay đổi', actionType: 'change' },
    { label: 'Biệt danh', value: user?.email || 'N/A', action: 'Thay đổi', actionType: 'change' },
    { label: 'Giới tính', value: user?.gender || 'khác', action: 'Thay đổi', actionType: 'change' },
    { label: 'Ngày sinh', value: 'Chưa cập nhật', action: 'Thay đổi', actionType: 'change' },
    { label: 'Số điện thoại', value: user?.phone || 'Chưa cập nhật', action: 'Xác thực', actionType: 'verify' },
  ]

  const handleAction = (field: ProfileField) => {
    setIsEditing(field.label)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Green Header Banner */}
      <div className="relative h-24 bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-4 w-16 h-16 border-2 border-white/30 rounded-full" />
          <div className="absolute top-4 left-20 w-12 h-12 border-2 border-white/30 rounded-full" />
          <div className="absolute bottom-2 right-10 w-20 h-20 border-2 border-white/30 rounded-full" />
          <div className="absolute top-1 right-32 w-8 h-8 border-2 border-white/30 rounded-full" />
          <svg className="absolute bottom-0 left-1/3 w-24 h-24 text-white/20" viewBox="0 0 100 100">
            <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 text-sm font-medium">
          Thông tin tài khoản
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800 mb-6">Thông tin tài khoản</h1>

        {/* Avatar Section */}
        <div className="mb-8">
          <AvatarUpload />
        </div>

        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tài khoản</h2>
          <div className="space-y-0 divide-y divide-gray-100">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-center py-4">
                <span className="w-40 text-gray-600">{field.label}</span>
                <span className="flex-1 text-gray-800">{field.value}</span>
                {field.action && (
                  <button
                    onClick={() => handleAction(field)}
                    className={`text-sm font-medium ${
                      field.actionType === 'verify'
                        ? 'text-primary hover:text-primary-hover'
                        : 'text-primary hover:text-primary-hover'
                    }`}
                  >
                    {field.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Shipping Address Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Địa chỉ giao hàng</h2>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              <Plus size={16} />
              <span>Thêm địa chỉ mới</span>
            </button>
          </div>

          {/* Empty State */}
          <div className="py-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Chưa có địa chỉ giao hàng nào</p>
          </div>
        </div>
      </div>
    </div>
  )
}
