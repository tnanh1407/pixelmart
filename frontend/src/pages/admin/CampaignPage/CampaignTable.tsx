import { useState } from 'react'
import { Trash2, Image, Loader2, Copy } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import ImagePreviewDialog from '@/components/ui/image-preview-dialog'
import { toast } from 'sonner'

interface Campaign {
  _id: string
  title: string
  image?: string
  isActive: boolean
  author?: string
}

interface CampaignTableProps {
  campaigns: Campaign[]
  isLoading: boolean
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
  onViewDetail: (campaign: Campaign) => void
}

export default function CampaignTable({
  campaigns,
  isLoading,
  onDelete,
  onToggleActive,
  isDeleting,
  onViewDetail,
}: CampaignTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-20">
        <Image size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Chưa có chiến dịch nào</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25 px-6">Mã định danh</TableHead>
            <TableHead className="w-25 px-6">Hình ảnh</TableHead>
            <TableHead className="px-6">Tiêu đề</TableHead>
            <TableHead className="px-6">Tác giả</TableHead>
            <TableHead className="px-6">Trạng thái</TableHead>
            <TableHead className="text-right px-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign._id}>
              <TableCell className="px-6 py-4 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span>{campaign._id}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(campaign._id)
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
                  onClick={() => setPreviewCampaign(campaign)}
                  className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  {campaign.image ? (
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={16} className="text-text-muted" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="max-w-75">
                  <p
                    onClick={() => onViewDetail(campaign)}
                    className="font-medium text-text text-sm truncate cursor-pointer hover:text-primary transition-colors"
                  >
                    {campaign.title}
                  </p>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-text-muted">
                {campaign.author || '—'}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleActive(campaign._id, campaign.isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                    campaign.isActive ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                      campaign.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTargetId(campaign._id)}
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

      <ImagePreviewDialog
        open={!!previewCampaign}
        onOpenChange={(open) => !open && setPreviewCampaign(null)}
        src={previewCampaign?.image}
        alt={previewCampaign?.title}
      />
    </div>
  )
}
