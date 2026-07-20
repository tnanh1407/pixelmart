import { useState } from 'react'
import { Package, Star, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAdminProductMutations } from '@/hooks/admin/products'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { IProduct } from '@/types/product.types'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

interface ProductTableProps {
  products: IProduct[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <Package size={20} className="text-muted-foreground" />
      )}
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-12" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-20" /></TableCell>
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

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Package size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy sản phẩm nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function ProductTable({
  products,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: ProductTableProps) {
  const { toggleActiveMutation, toggleFeaturedMutation } = useAdminProductMutations(products)
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left">Sản phẩm</TableHead>
          <TableHead className="px-6 text-left w-28">Giá</TableHead>
          <TableHead className="px-6 text-left w-20">Kho</TableHead>
          <TableHead className="px-6 text-left w-28">Đánh giá</TableHead>
          <TableHead className="px-6 text-left w-32">Trạng thái</TableHead>
          <TableHead className="px-6 text-right w-32">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : products.length === 0 ? (
          <EmptyRow />
        ) : (
          products.map((p) => (
            <TableRow key={p._id} className="group">
              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <ProductImage src={p.images?.[0]} alt={p.name} />
                  <div className="min-w-0">
                    <p className="max-w-[220px] truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand || 'Chưa có thương hiệu'}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-3">
                {p.discountPrice ? (
                  <div>
                    <p className="text-sm font-medium text-destructive">{formatPrice(p.discountPrice)}</p>
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(p.price)}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground">{formatPrice(p.price)}</p>
                )}
              </TableCell>

              <TableCell className="px-6 py-3">
                <span className={cn('text-sm font-medium', p.stock <= 0 ? 'text-destructive' : 'text-foreground')}>
                  {p.stock}
                </span>
              </TableCell>

              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm text-foreground">{p.ratingsAverage?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-muted-foreground">({p.ratingsQuantity || 0})</span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <Switch
                    size="sm"
                    checked={localActive[p._id] ?? p.isActive}
                    onCheckedChange={() => {
                      const next = !p.isActive
                      setLocalActive((prev) => ({ ...prev, [p._id]: next }))
                      toggleActiveMutation.mutate({ id: p._id, isActive: next })
                    }}
                    disabled={toggleActiveMutation.isPending}
                  />
                  {p.isFeatured && (
                    <Badge variant="secondary" className="border-none bg-amber-500/10 text-amber-700">
                      Nổi bật
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                    onClick={() => toggleFeaturedMutation.mutate(p._id)}
                    disabled={toggleFeaturedMutation.isPending}
                    title={p.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                  >
                    <Star size={16} className={p.isFeatured ? 'fill-amber-500' : ''} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(p._id)}
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
