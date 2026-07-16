import { Trash2, Edit, Image, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
  onViewDetail: (banner: Banner) => void
}

export default function BannerTable({
  banners,
  isLoading,
  onDelete,
  onToggleActive,
  isDeleting,
  onViewDetail,
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
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25 px-6">Hình ảnh</TableHead>
            <TableHead className="px-6">Tiêu đề</TableHead>
            <TableHead className="px-6">Thứ tự</TableHead>
            <TableHead className="px-6">Thời gian</TableHead>
            <TableHead className="px-6">Trạng thái</TableHead>
            <TableHead className="text-right px-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner._id}>
              <TableCell className="px-6 py-4">
                <div
                  onClick={() => onViewDetail(banner)}
                  className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="max-w-75">
                  <p
                    onClick={() => onViewDetail(banner)}
                    className="font-medium text-gray-900 text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    {banner.title}
                  </p>
                  {banner.shortDescription && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{banner.shortDescription}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm text-gray-700">{banner.order}</TableCell>
              <TableCell className="px-6 py-4 text-xs text-gray-500">
                {banner.startDate ? new Date(banner.startDate).toLocaleDateString('vi-VN') : '—'}
                {' → '}
                {banner.endDate ? new Date(banner.endDate).toLocaleDateString('vi-VN') : '—'}
              </TableCell>
              <TableCell className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onToggleActive(banner._id, banner.isActive)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={banner.isActive ? 'default' : 'destructive'}
                    className={banner.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-700 shadow-none border-none' : 'shadow-none border-none'}
                  >
                    {banner.isActive ? 'Hiện' : 'Ẩn'}
                  </Badge>
                </button>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
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
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
