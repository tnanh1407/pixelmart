import { Calendar, Info, Tag, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface CategoryDetailModalProps {
  show: boolean
  category: Category | null
  onClose: () => void
}

export default function CategoryDetailModal({ show, category, onClose }: CategoryDetailModalProps) {
  if (!category) return null

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-row items-center gap-2 space-y-0">
          <Tag size={18} className="text-indigo-600" />
          <DialogTitle>Chi tiết danh mục</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {category.image ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Tag size={32} className="mb-2" />
              <span className="text-xs">Không có hình ảnh</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên danh mục</span>
              <p className="text-base font-semibold text-gray-900 mt-0.5">{category.name}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả</span>
              <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[60px]">
                {category.description || 'Chưa có mô tả cho danh mục này.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Trạng thái</span>
                <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  category.isActive
                    ? 'bg-green-50 text-green-700 border border-green-200/50'
                    : 'bg-red-50 text-red-700 border border-red-200/50'
                }`}>
                  {category.isActive ? (
                    <>
                      <CheckCircle size={12} className="text-green-500" />
                      Hoạt động
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="text-red-500" />
                      Ẩn
                    </>
                  )}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Danh mục</span>
                <p className="text-xs font-mono text-gray-500 mt-1 select-all">{category._id}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />
                <div>
                  <span className="block text-[10px] text-gray-400">Ngày tạo</span>
                  <span>{category.createdAt ? new Date(category.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Info size={14} className="text-gray-400" />
                <div>
                  <span className="block text-[10px] text-gray-400">Cập nhật lúc</span>
                  <span>{category.updatedAt ? new Date(category.updatedAt).toLocaleString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
