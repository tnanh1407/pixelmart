import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ImageIcon, Tag, Trash2 } from 'lucide-react'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
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

// ─── Types ───────────────────────────────────────────────────────────────────

export type CategoryRow = {
  _id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
  createdAt?: string
}

interface CategoryTableProps {
  categories: CategoryRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}


// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <ImageIcon size={14} className="text-muted-foreground" />
      )}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-28" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-40" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Tag size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy danh mục nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CategoryTable({
  categories,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: CategoryTableProps) {
  const navigate = useNavigate()
  const { toggleActiveMutation } = useAdminCategoryMutations()
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left w-72">Mã định danh</TableHead>
          <TableHead className="px-6 text-left w-72">Danh mục</TableHead>
          <TableHead className="px-6 text-left">Mô tả</TableHead>
          <TableHead className="px-6 text-left w-32">Trạng thái</TableHead>
          <TableHead className="px-6 text-right w-28">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : categories.length === 0 ? (
          <EmptyRow />
        ) : (
          categories.map((cat) => (
            <TableRow key={cat._id} className="group">
              {/* Mã định danh */}

              <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>{cat._id}</span>
                  <CopyButton text={cat._id} />
                </div>
              </TableCell>

              {/* Danh mục — ảnh + tên */}
              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <CategoryImage src={cat.image} alt={cat.name} />
                  <span
                    onClick={() => navigate(`/admin/categories/${cat._id}`)}
                    className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
                  >
                    {cat.name}
                  </span>
                </div>
              </TableCell>


              {/* Mô tả */}
              <TableCell className="px-6 py-3 text-xs text-muted-foreground max-w-xs">
                <p className="truncate">{cat.description || '—'}</p>
              </TableCell>

              {/* Trạng thái */}
              <TableCell className="px-6 py-3">
                <Switch
                  size="sm"
                  checked={localActive[cat._id] ?? cat.isActive}
                  onCheckedChange={() => {
                    const next = !cat.isActive
                    setLocalActive((prev) => ({ ...prev, [cat._id]: next }))
                    toggleActiveMutation.mutate({ id: cat._id, isActive: next })
                  }}
                />
              </TableCell>


              {/* Thao tác */}
              <TableCell className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(cat._id)}
                    disabled={isDeleting}
                    title="Xóa"
                  >
                    <Trash2 />
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
