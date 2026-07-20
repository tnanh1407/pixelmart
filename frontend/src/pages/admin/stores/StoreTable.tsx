import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Store, ShieldCheck, Trash2 } from 'lucide-react'
import { useAdminStoreMutations } from '@/hooks/admin/stores'
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
import { Badge } from '@/components/ui/badge'
import type { StoreListResponse } from '@/services/admin/admin.service'

// ─── Types ───────────────────────────────────────────────────────────────────

export type StoreRow = StoreListResponse['stores'][number]

interface StoreTableProps {
  stores: StoreRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StoreImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <Store size={18} className="text-muted-foreground" />
      )}
    </div>
  )
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-3 w-28" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Store size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy cửa hàng nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function StoreTable({
  stores,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: StoreTableProps) {
  const navigate = useNavigate()
  const { toggleActiveMutation, toggleVerifiedMutation } = useAdminStoreMutations({ stores })
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left w-64">Mã định danh</TableHead>
          <TableHead className="px-6 text-left w-64">Cửa hàng</TableHead>
          <TableHead className="px-6 text-left">Chủ cửa hàng</TableHead>
          <TableHead className="px-6 text-left w-28">Đánh giá</TableHead>
          <TableHead className="px-6 text-left w-32">Trạng thái</TableHead>
          <TableHead className="px-6 text-right w-40">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : stores.length === 0 ? (
          <EmptyRow />
        ) : (
          stores.map((s) => (
            <TableRow key={s._id} className="group">
              {/* Mã định danh */}

              <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>{s._id}</span>
                  <CopyButton text={s._id} />
                </div>
              </TableCell>
              {/* Cửa hàng — ảnh + tên */}
              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <StoreImage src={s.logo} alt={s.name} />
                  <div>
                    <p
                      onClick={() => navigate(`/admin/stores/${s._id}`)}
                      className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
                    >
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.slug}</p>
                  </div>
                </div>
              </TableCell>

              {/* Liên hệ */}
              <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                <div>
                  <p
                    onClick={() => navigate(`/admin/stores/${s._id}`)}
                    className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
                  >
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.slug}</p>
                </div>
              </TableCell>

              {/* Đánh giá */}
              <TableCell className="px-6 py-3 text-xs">
                <span className="font-semibold">{s.ratingsAverage?.toFixed(1) || '0.0'}</span>
                <span className="text-muted-foreground ml-0.5">({s.ratingsQuantity || 0})</span>
              </TableCell>

              {/* Trạng thái */}
              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <Switch
                    size="sm"
                    checked={localActive[s._id] ?? s.isActive}
                    onCheckedChange={() => {
                      const next = !s.isActive
                      setLocalActive((prev) => ({ ...prev, [s._id]: next }))
                      toggleActiveMutation.mutate({ id: s._id, isActive: next })
                    }}
                    disabled={toggleActiveMutation.isPending}
                  />
                  {s.isVerified && (
                    <Badge variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 shadow-none border-none flex items-center gap-1">
                      <ShieldCheck size={10} className="fill-blue-700 text-white" />
                      Xác minh
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Thao tác */}
              <TableCell className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`size-8 cursor-pointer ${s.isVerified ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => toggleVerifiedMutation.mutate(s._id)}
                    disabled={toggleVerifiedMutation.isPending}
                    title={s.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                  >
                    <ShieldCheck size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(s._id)}
                    disabled={isDeleting}
                    title="Xóa"
                  >
                    <Trash2 size={16} />
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
