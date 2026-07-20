import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'

// ─── Types ───────────────────────────────────────────────────────────────────

export type BannerRow = {
  _id: string
  title: string
  image: string
  position: string
  type: string
  order: number
  isActive: boolean
}

interface BannerTableProps {
  data: BannerRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const positionLabels: Record<string, string> = {
  home_top: 'Đầu trang chủ',
  home_middle: 'Giữa trang chủ',
  sidebar: 'Sidebar',
  popup: 'Popup',
}

const typeLabels: Record<string, string> = {
  slider: 'Slider',
  static: 'Tĩnh',
  promo_card: 'Promo Card',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <Skeleton className="w-20 h-12 rounded-lg" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-3.5 w-32" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-24 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-3 w-10" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4 text-right">
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
      <TableCell colSpan={7} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy banner nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BannerTable({
  data,
  isLoading = false,
  onDelete,
}: BannerTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left w-24">Hình ảnh</TableHead>
          <TableHead className="px-6 text-left">Tiêu đề</TableHead>
          <TableHead className="px-6 text-left">Vị trí</TableHead>
          <TableHead className="px-6 text-left">Loại</TableHead>
          <TableHead className="px-6 text-left">Thứ tự</TableHead>
          <TableHead className="px-6 text-left w-32">Trạng thái</TableHead>
          <TableHead className="px-6 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : data.length === 0 ? (
          <EmptyRow />
        ) : (
          data.map((b) => (
            <TableRow key={b._id} className="group">
              {/* Hình ảnh */}
              <TableCell className="px-6 py-4">
                <div className="w-20 h-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                  {b.image ? (
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={16} className="text-muted-foreground" />
                  )}
                </div>
              </TableCell>

              {/* Tiêu đề */}
              <TableCell className="px-6 py-4">
                <p className="font-medium text-foreground text-sm truncate max-w-[220px]">
                  {b.title}
                </p>
              </TableCell>

              {/* Vị trí */}
              <TableCell className="px-6 py-4">
                <Badge variant="secondary" className="font-normal text-xs">
                  {positionLabels[b.position] || b.position}
                </Badge>
              </TableCell>

              {/* Loại */}
              <TableCell className="px-6 py-4">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {typeLabels[b.type] || b.type}
                </span>
              </TableCell>

              {/* Thứ tự */}
              <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                {b.order}
              </TableCell>

              {/* Trạng thái */}
              <TableCell className="px-6 py-4">
                <Badge
                  className={cn(
                    'border-none shadow-none text-xs font-semibold px-2.5 py-0.5',
                    statusVariantClass(b.isActive ? 'active' : 'inactive')
                  )}
                />
              </TableCell>

              {/* Thao tác */}
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/banners/${b._id}/edit`)}
                    title="Chỉnh sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(b._id)}
                    title="Xóa"
                    className="text-destructive hover:text-destructive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
