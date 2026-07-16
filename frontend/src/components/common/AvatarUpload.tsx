import { useState, useRef } from 'react'
import { Camera, Loader2, User, Eye } from 'lucide-react'
import Swal from 'sweetalert2'
import useUserStore from '@/stores/useUserStore'

export default function AvatarUpload() {
  const { user, uploadAvatar } = useUserStore()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleViewAvatar = () => {
    if (!user?.avatar) {
      Swal.fire({
        icon: 'info',
        title: 'Chưa có ảnh đại diện',
        text: 'Vui lòng nhấn nút "Chọn ảnh đại diện" bên cạnh để tải ảnh lên.',
        confirmButtonColor: '#049645',
      })
      return
    }

    Swal.fire({
      title: user.name || 'Ảnh đại diện',
      imageUrl: user.avatar,
      imageAlt: user.name || 'Ảnh đại diện',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: '!rounded-2xl max-w-lg',
        image: 'rounded-xl max-h-[70vh] object-contain',
      },
    })
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

    // Tạo URL xem trước cục bộ
    const previewUrl = URL.createObjectURL(file)

    const result = await Swal.fire({
      title: 'Xem trước ảnh đại diện',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 0;">
          <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; border: 4px solid #049645; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); background-color: #f3f4f6;">
            <img src="${previewUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <p style="margin-top: 15px; font-size: 14px; color: #4b5563; font-weight: 500;">
            Bạn có muốn chọn ảnh này làm ảnh đại diện mới?
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#049645',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: '!rounded-2xl',
        confirmButton: '!rounded-xl !px-6 !py-2.5 !text-sm !font-semibold',
        cancelButton: '!rounded-xl !px-6 !py-2.5 !text-sm !font-semibold',
        actions: '!gap-2',
      },
    })

    // Giải phóng bộ nhớ của URL tạm thời
    URL.revokeObjectURL(previewUrl)

    if (result.isConfirmed) {
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
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-xs">
      {/* Avatar Container */}
      <div 
        className="relative w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-md ring-4 ring-primary/10 transition-all duration-300 hover:ring-primary/20 hover:scale-102 group cursor-pointer"
        onClick={handleViewAvatar}
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name || 'User Avatar'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <User className="w-12 h-12 text-gray-300 transition-colors duration-300 group-hover:text-gray-400" />
          </div>
        )}

        {/* Hover/Upload Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <>
              <Eye className="w-6 h-6 text-white mb-1" />
              <span className="text-[10px] text-white font-medium">Xem ảnh</span>
            </>
          )}
        </div>

        {/* Active Uploading Overlay (always visible when uploading) */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Info & Button Group */}
      <div className="flex-1 text-center sm:text-left space-y-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Ảnh hồ sơ</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Hỗ trợ định dạng JPG, PNG hoặc WebP.
            <br />
            Dung lượng file tối đa 2MB.
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover disabled:bg-primary/50 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <span>Chọn ảnh đại diện</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
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
