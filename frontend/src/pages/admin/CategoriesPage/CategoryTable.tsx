import { Tag, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
}

interface CategoryTableProps {
  categories: Category[]
  isLoading: boolean
  onDelete: (id: string) => void
  isDeleting: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  onViewDetail: (category: Category) => void
}

export default function CategoryTable({
  categories,
  isLoading,
  onDelete,
  isDeleting,
  pagination,
  page,
  setPage,
  onViewDetail,
}: CategoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <Tag size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Không tìm thấy danh mục nào</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25 px-6">Hình ảnh</TableHead>
              <TableHead className="px-6">Tên danh mục</TableHead>
              <TableHead className="px-6">Mô tả</TableHead>
              <TableHead className="px-6">Trạng thái</TableHead>
              <TableHead className="text-right px-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell className="px-6 py-4">
                  <div
                    onClick={() => onViewDetail(cat)}
                    className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => onViewDetail(cat)}
                  className="px-6 py-4 font-medium text-gray-900 text-sm cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {cat.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '—'}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant={cat.isActive ? 'default' : 'destructive'}
                    className={cat.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-700 shadow-none border-none' : 'shadow-none border-none'}
                  >
                    {cat.isActive ? 'Hoạt động' : 'Ẩn'}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        Swal.fire({
                          title: 'Xác nhận xóa?',
                          text: 'Bạn có chắc chắn muốn xóa danh mục này? Thao tác này không thể hoàn tác.',
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
                            onDelete(cat._id)
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
