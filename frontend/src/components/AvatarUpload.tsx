import { useState, useRef } from 'react'
import { Camera, Loader2, User } from 'lucide-react'
import Swal from 'sweetalert2'
import useUserStore from '@/stores/useUserStore'

export default function AvatarUpload() {
  const { user, uploadAvatar } = useUserStore()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'File quá lớn',
        text: 'Kích thước file tối đa 2MB',
        confirmButtonColor: '#049645',
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'File không hợp lệ',
        text: 'Chỉ chấp nhận file ảnh (JPG, PNG, WebP)',
        confirmButtonColor: '#049645',
      })
      return
    }

    setIsUploading(true)
    try {
      await uploadAvatar(file)
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật ảnh đại diện thành công!',
        confirmButtonColor: '#049645',
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload thất bại',
        text: err?.response?.data?.message || 'Không thể upload ảnh',
        confirmButtonColor: '#049645',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={40} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {isUploading ? (
          <Loader2 size={24} className="text-white animate-spin" />
        ) : (
          <Camera size={24} className="text-white" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
