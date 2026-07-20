import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Image, Trash2 } from 'lucide-react'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import { CopyButton } from '@/components/admin/shared'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export type CampaignRow = {
  _id: string
  title: string
  image?: string
  isActive: boolean
  author?: string
}

interface CampaignTableProps {
  campaigns: CampaignRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  onPreviewImage: (campaign: CampaignRow) => void
  isDeleting?: boolean
}

function CampaignImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="w-20 h-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <Image size={16} className="text-muted-foreground" />
      )}
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-12 w-20 rounded-lg" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3.5 w-40" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4 text-center"><Skeleton className="h-5 w-11 rounded-full mx-auto" /></TableCell>
          <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Image size={36} className="opacity-30" />
          <p className="text-sm">Chưa có chiến dịch nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function CampaignTable({
  campaigns,
  isLoading = false,
  onDelete,
  onPreviewImage,
  isDeleting = false,
}: CampaignTableProps) {
  const navigate = useNavigate()
  const { toggleActiveMutation } = useAdminCampaignMutations()
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left w-25">Mã định danh</TableHead>
          <TableHead className="px-6 text-left w-28">Hình ảnh</TableHead>
          <TableHead className="px-6 text-left">Tiêu đề</TableHead>
          <TableHead className="px-6 text-left w-36">Tác giả</TableHead>
          <TableHead className="px-6 text-center w-28">Trạng thái</TableHead>
          <TableHead className="px-6 text-right w-20">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : campaigns.length === 0 ? (
          <EmptyRow />
        ) : (
          campaigns.map((c) => (
            <TableRow key={c._id} className="group">
              <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>{c._id}</span>
                  <CopyButton text={c._id} />
                </div>
              </TableCell>

              <TableCell className="px-6 py-3">
                <div
                  onClick={() => onPreviewImage(c)}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <CampaignImage src={c.image} alt={c.title} />
                </div>
              </TableCell>

              <TableCell className="px-6 py-3">
                <p
                  onClick={() => navigate(`/admin/campaigns/${c._id}`)}
                  className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1 max-w-64"
                >
                  {c.title}
                </p>
              </TableCell>

              <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                {c.author || '\u2014'}
              </TableCell>

              <TableCell className="px-6 py-3 text-center">
                <Switch
                  size="sm"
                  checked={localActive[c._id] ?? c.isActive}
                  onCheckedChange={() => {
                    const next = !c.isActive
                    setLocalActive((prev) => ({ ...prev, [c._id]: next }))
                    toggleActiveMutation.mutate({ id: c._id, isActive: next })
                  }}
                  disabled={toggleActiveMutation.isPending}
                />
              </TableCell>

              <TableCell className="px-6 py-3 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  onClick={() => onDelete(c._id)}
                  disabled={isDeleting}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
