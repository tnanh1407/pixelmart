import useUserStore from '@/stores/useUserStore'

interface ProfileField {
  label: string
  value: string
  action?: string
}

interface ProfileInfoSectionProps {
  onAction: (label: string) => void
}

const genderMap: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
}

const formatGender = (gender?: string) => genderMap[gender || ''] || 'Khác'

export default function ProfileInfoSection({ onAction }: ProfileInfoSectionProps) {
  const { user } = useUserStore()

  const profileFields: ProfileField[] = [
    { label: 'Email', value: user?.email || 'N/A' },
    { label: 'Mật khẩu', value: '••••••••••••', action: user?.hasPassword ? 'Thay đổi' : undefined },
    { label: 'Họ và tên', value: user?.name || 'N/A', action: 'Thay đổi' },
    { label: 'Giới tính', value: formatGender(user?.gender), action: 'Thay đổi' },
    { label: 'Ngày sinh', value: user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật', action: 'Thay đổi' },
    { label: 'Số điện thoại', value: user?.phone || 'Chưa cập nhật', action: 'Thay đổi' },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Tài khoản</h2>
      <div className="space-y-0 divide-y divide-gray-100">
        {profileFields.map((field) => (
          <div key={field.label} className="flex items-center py-4">
            <span className="w-40 text-gray-600">{field.label}</span>
            <span className="flex-1 text-gray-800">{field.value}</span>
            {field.action && (
              <button
                onClick={() => onAction(field.label)}
                className="text-sm font-medium cursor-pointer text-primary hover:text-primary-hover"
              >
                {field.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
