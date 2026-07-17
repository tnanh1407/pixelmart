import { useState } from 'react'
import { Trash2, Image, Loader2, Copy } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Campaign {
  _id: string
  title: string
  image?: string
  isActive: boolean
  author: string
}

interface CampaignTableProps {
  banners: Campaign[]
  isLoading: boolean
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
  onViewDetail: (banner: Campaign) => void
}

export default function CampaignTable({
  banners,
  isLoading,
  onDelete,
  onToggleActive,
  isDeleting,
  onViewDetail,
}: CampaignTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

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
        <p className="text-gray-500">Chưa có chiến dịch nào</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25 px-6">Mã định danh</TableHead>
            <TableHead className="w-25 px-6">ảnh</TableHead>
            <TableHead className="px-6">Tiêu đề</TableHead>
            <TableHead className="px-6">Tác giả</TableHead>
            <TableHead className="px-6">Trạng thái</TableHead>
            <TableHead className="text-right px-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner._id}>
              <TableCell className="px-6 py-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span>{banner._id}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(banner._id)
                      toast.success('Đã copy ID')
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
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-gray-500">
                {banner.author}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
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
                    onClick={() => setDeleteTargetId(banner._id)}
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

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chiến dịch này? Thao tác này không thể hoàn tác.
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
    </div>
  )
}
