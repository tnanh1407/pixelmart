import { useState } from 'react'
import { type StoreListResponse } from '@/services/admin/admin.service'
import { Trash2, CheckCircle, XCircle, Loader2, Store, ShieldCheck, Copy } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type StoreItem = StoreListResponse['stores'][number]

interface StoresTableProps {
  stores: StoreItem[]
  isLoading: boolean
  onToggleVerified: (id: string) => void
  isToggleVerifiedPending: boolean
  onToggleActive: (id: string) => void
  isToggleActivePending: boolean
  onDelete: (id: string) => void
  isDeletePending: boolean
  onViewDetail: (store: StoreItem) => void
}

export default function StoresTable({
  stores,
  isLoading,
  onToggleVerified,
  isToggleVerifiedPending,
  onToggleActive,
  isToggleActivePending,
  onDelete,
  isDeletePending,
  onViewDetail,
}: StoresTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-20">
        <Store size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Không tìm thấy cửa hàng nào</p>
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
              <TableHead className="px-6">Cửa hàng</TableHead>
              <TableHead className="px-6">Liên hệ</TableHead>
              <TableHead className="px-6">Đánh giá</TableHead>
              <TableHead className="px-6">Trạng thái</TableHead>
              <TableHead className="text-right px-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store._id}>
                <TableCell className="px-6 py-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <span>{store._id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(store._id)
                        toast.success('Đã copy ID')
                      }}
                      className="shrink-0 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                      title="Copy ID"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => onViewDetail(store)}
                      className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-85 transition-opacity border border-gray-100"
                    >
                      {store.logo ? (
                        <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store size={18} className="text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        onClick={() => onViewDetail(store)}
                        className="font-medium text-text text-sm cursor-pointer hover:text-primary transition-colors"
                      >
                        {store.name}
                      </p>
                      <p className="text-xs text-text-muted">{store.email || 'N/A'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-text-muted">{store.phone || 'N/A'}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-text">
                  <span className="font-semibold">{store.ratingsAverage?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-text-muted ml-0.5"> ({store.ratingsQuantity || 0})</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={store.isActive ? 'default' : 'destructive'}
                      className={`shadow-none border-none ${
                        store.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-700' : ''
                      }`}
                    >
                      {store.isActive ? 'Hoạt động' : 'Ẩn'}
                    </Badge>
                    {store.isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 shadow-none border-none flex items-center gap-1"
                      >
                        <ShieldCheck size={10} className="fill-blue-700 text-white" />
                        Xác minh
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleVerified(store._id)}
                      disabled={isToggleVerifiedPending}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        store.isVerified ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' : 'text-text-muted hover:bg-gray-100'
                      }`}
                      title={store.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                    >
                      <CheckCircle size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleActive(store._id)}
                      disabled={isToggleActivePending}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        store.isActive ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : 'text-text-muted hover:bg-gray-100'
                      }`}
                      title={store.isActive ? 'Ẩn cửa hàng' : 'Hiện cửa hàng'}
                    >
                      {store.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTargetId(store._id)}
                      disabled={isDeletePending}
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
              Bạn có chắc chắn muốn xóa cửa hàng này? Thao tác này không thể hoàn tác.
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
