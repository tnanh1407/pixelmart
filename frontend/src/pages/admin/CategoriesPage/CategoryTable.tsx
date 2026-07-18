import { Tag, Trash2, Loader2, Copy } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

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
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
  onViewDetail: (category: Category) => void
}

export default function CategoryTable({
  categories,
  isLoading,
  onDelete,
  onToggleActive,
  isDeleting,
  onViewDetail,
}: CategoryTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <Tag size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Không tìm thấy danh mục nào</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25 px-6">Mã định danh</TableHead>
              <TableHead className="w-25 px-6">Hình ảnh</TableHead>
              <TableHead className="px-6">Tên danh mục</TableHead>
              <TableHead className="px-6">Mô tả</TableHead>
              <TableHead className="px-6 text-center">Trạng thái</TableHead>
              <TableHead className="text-right px-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell className="px-6 py-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <span>{cat._id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cat._id)
                        toast.success('Đã copy ID', { closeButton: true })
                      }}
                      className="shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy ID"
                    >
                      <Copy size={12} className='cursor-pointer' />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div
                    onClick={() => onViewDetail(cat)}
                    className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={16} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => onViewDetail(cat)}
                  className="px-6 py-4 font-medium text-text text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  {cat.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-text-muted max-w-xs truncate">{cat.description || '—'}</TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleActive(cat._id, cat.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                      cat.isActive ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                        cat.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTargetId(cat._id)}
                      disabled={isDeleting}
                      className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-600 cursor-pointer"
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteTargetId) onDelete(deleteTargetId)
              setDeleteTargetId(null)
            }}>
              Đồng ý xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
