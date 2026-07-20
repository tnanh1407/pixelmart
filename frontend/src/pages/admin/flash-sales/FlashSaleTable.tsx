import { useNavigate } from 'react-router-dom'
import { Zap, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'

export type FlashSaleRow = {
  _id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
}

interface FlashSaleTableProps {
  flashSales: FlashSaleRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const statusLabels: Record<string, string> = {
  scheduled: 'Sắp diễn ra',
  active: 'Đang diễn ra',
  ended: 'Đã kết thúc',
  cancelled: 'Đã hủy',
}

const statusVariantMap: Record<string, string> = {
  scheduled: 'pending',
  active: 'active',
  ended: 'inactive',
  cancelled: 'cancelled',
}

const formatDate = (date?: string) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getDuration = (start?: string, end?: string) => {
  if (!start || !end) return '\u2014'
  const diff = new Date(end).getTime() - new Date(start).getTime()
  if (diff <= 0) return '0 ngày'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days} ngày ${hours} giờ`
  return `${hours} giờ`
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="py-3"><Skeleton className="h-3.5 w-48" /></TableCell>
          <TableCell className="py-3"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
          <TableCell className="py-3"><Skeleton className="h-3 w-32" /></TableCell>
          <TableCell className="py-3"><Skeleton className="h-3 w-32" /></TableCell>
          <TableCell className="py-3"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="py-3 text-right">
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
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
          <Zap size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy flash sale nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function FlashSaleTable({
  flashSales,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: FlashSaleTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6">Tên chương trình</TableHead>
          <TableHead className="px-6 w-32">Trạng thái</TableHead>
          <TableHead className="px-6 w-36">Ngày bắt đầu</TableHead>
          <TableHead className="px-6 w-36">Ngày kết thúc</TableHead>
          <TableHead className="px-6 w-28">Thời lượng</TableHead>
          <TableHead className="px-6 text-right w-24">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : flashSales.length === 0 ? (
          <EmptyRow />
        ) : (
          flashSales.map((fs) => (
            <TableRow key={fs._id} className="group">
              <TableCell className="px-6 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">{fs.name}</p>
                  {fs.description && <p className="text-xs text-muted-foreground truncate max-w-[250px] mt-0.5">{fs.description}</p>}
                </div>
              </TableCell>

              <TableCell className="px-6 py-3">
                <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(statusVariantMap[fs.status] || 'inactive'))}>
                  {statusLabels[fs.status] || fs.status}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-3 text-sm text-muted-foreground">{formatDate(fs.startDate)}</TableCell>
              <TableCell className="px-6 py-3 text-sm text-muted-foreground">{formatDate(fs.endDate)}</TableCell>
              <TableCell className="px-6 py-3 text-sm text-muted-foreground">{getDuration(fs.startDate, fs.endDate)}</TableCell>

              <TableCell className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/flash-sales/${fs._id}/edit`)} title="Chỉnh sửa">
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(fs._id)} disabled={isDeleting} className="text-destructive hover:text-destructive" title="Xóa">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
