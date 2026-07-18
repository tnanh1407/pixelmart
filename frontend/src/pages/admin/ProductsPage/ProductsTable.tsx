import { useState } from 'react'
import { Eye, EyeOff, Loader2, Package, Star, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { IProduct } from '@/types/product.types'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)

interface ProductsTableProps {
  products: IProduct[]
  isLoading: boolean
  onToggleActive: (id: string) => void
  isToggleActivePending: boolean
  onToggleFeatured: (id: string) => void
  isToggleFeaturedPending: boolean
  onDelete: (id: string) => void
  isDeletePending: boolean
}

export default function ProductsTable({
  products,
  isLoading,
  onToggleActive,
  isToggleActivePending,
  onToggleFeatured,
  isToggleFeaturedPending,
  onDelete,
  isDeletePending,
}: ProductsTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Không tìm thấy sản phẩm nào</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6">Sản phẩm</TableHead>
            <TableHead className="px-6">Giá</TableHead>
            <TableHead className="px-6">Kho</TableHead>
            <TableHead className="px-6">Đánh giá</TableHead>
            <TableHead className="px-6">Trạng thái</TableHead>
            <TableHead className="px-6 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package size={20} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-[220px] truncate text-sm font-medium text-text">{product.name}</p>
                    <p className="text-xs text-text-muted">{product.brand || 'Chưa có thương hiệu'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                {product.discountPrice ? (
                  <div>
                    <p className="text-sm font-medium text-destructive">{formatPrice(product.discountPrice)}</p>
                    <p className="text-xs text-text-muted line-through">{formatPrice(product.price)}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-text">{formatPrice(product.price)}</p>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className={product.stock <= 0 ? 'text-sm font-medium text-destructive' : 'text-sm font-medium text-text'}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm text-text">{product.ratingsAverage?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-text-muted">({product.ratingsQuantity || 0})</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={product.isActive ? 'default' : 'destructive'}
                    className={product.isActive ? 'border-none bg-green-500/10 text-green-700 hover:bg-green-500/20' : 'border-none'}
                  >
                    {product.isActive ? 'Đang bán' : 'Ẩn'}
                  </Badge>
                  {product.isFeatured && (
                    <Badge variant="secondary" className="border-none bg-amber-500/10 text-amber-700 hover:bg-amber-500/20">
                      Nổi bật
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleActive(product._id)}
                    disabled={isToggleActivePending}
                    className={`h-8 w-8 cursor-pointer ${product.isActive ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : 'text-text-muted hover:bg-gray-100'}`}
                    title={product.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                  >
                    {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFeatured(product._id)}
                    disabled={isToggleFeaturedPending}
                    className={`h-8 w-8 cursor-pointer ${product.isFeatured ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' : 'text-text-muted hover:bg-gray-100'}`}
                    title={product.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                  >
                    <Star size={16} className={product.isFeatured ? 'fill-amber-500' : ''} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTargetId(product._id)}
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.
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
