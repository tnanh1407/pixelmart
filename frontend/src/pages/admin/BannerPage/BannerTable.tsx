import { Trash2, Edit, Image, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'

interface Banner {
  _id: string
  title: string
  shortDescription?: string
  image?: string
  order: number
  startDate?: string
  endDate?: string
  isActive: boolean
}

interface BannerTableProps {
  banners: Banner[]
  isLoading: boolean
  onEdit: (banner: Banner) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
}

export default function BannerTable({
  banners,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  isDeleting,
}: BannerTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-20">
        <Image size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Chưa có banner nào</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Hình ảnh</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tiêu đề</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Thứ tự</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Thời gian</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
            <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {banners.map((banner) => (
            <tr key={banner._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{banner.title}</p>
                  {banner.shortDescription && (
                    <p className="text-xs text-gray-500 max-w-[200px] truncate">{banner.shortDescription}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{banner.order}</td>
              <td className="px-6 py-4 text-xs text-gray-500">
                {banner.startDate ? new Date(banner.startDate).toLocaleDateString('vi-VN') : '—'}
                {' → '}
                {banner.endDate ? new Date(banner.endDate).toLocaleDateString('vi-VN') : '—'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleActive(banner._id, banner.isActive)}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                    banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {banner.isActive ? 'Hiện' : 'Ẩn'}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(banner)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Xác nhận xóa?',
                        text: 'Bạn có chắc chắn muốn xóa banner này? Thao tác này không thể hoàn tác.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: 'Đồng ý xóa',
                        cancelButtonText: 'Hủy',
                        customClass: {
                          popup: '!rounded-xl',
                          confirmButton: '!rounded-lg !px-6 !ml-2',
                          cancelButton: '!rounded-lg !px-6',
                          actions: '!gap-2',
                        }
                      }).then((result) => {
                        if (result.isConfirmed) {
                          onDelete(banner._id)
                        }
                      })
                    }}
                    disabled={isDeleting}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
