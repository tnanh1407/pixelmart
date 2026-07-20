import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft,
  Package,
  DollarSign,
  Archive,
  Image as ImageIcon,
  Star,
  Calendar,
  Tag,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import {
  LoadingState,
  DetailCard,
  DetailField,
  DeleteDialog,
  ImagePreview,
} from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'
import type { IProduct } from '@/types/product.types'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data: product, isLoading, error } = useQuery<IProduct>({
    queryKey: ['admin-product-detail', id],
    queryFn: () => adminService.getProductById(id || ''),
    enabled: !!id,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-product-detail', id] })
    queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  }

  const toggleActiveMutation = useMutation({
    mutationFn: () => adminService.updateProduct(id!, { isActive: !product?.isActive }),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: () => adminService.updateProduct(id!, { isFeatured: !product?.isFeatured }),
    onSuccess: () => { invalidate(); toast.success('Cập nhật nổi bật thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteProduct(id!),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công')
      navigate('/admin/products')
    },
    onError: () => toast.error('Không thể xóa sản phẩm'),
  })

  if (isLoading) return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive-light">
          <Package size={32} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy sản phẩm</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Đã có lỗi xảy ra hoặc sản phẩm không tồn tại.
        </p>
        <Button onClick={() => navigate('/admin/products')} className="mt-4">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const categoryName =
    typeof product.categoryId === 'object' && product.categoryId !== null
      ? (product.categoryId as { name: string }).name
      : product.categoryId || 'N/A'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', statusVariantClass(product.isActive ? 'active' : 'inactive'))} />
              {product.isFeatured && (
                <Badge variant="secondary" className="bg-warning-light text-warning border-none">
                  Nổi bật
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Slug: {product.slug} | SKU: {product.sku || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toggleActiveMutation.mutate({ id: product._id, isActive: !product.isActive })}
            disabled={toggleActiveMutation.isPending}
          >
            {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            {product.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleFeaturedMutation.mutate()}
            disabled={toggleFeaturedMutation.isPending}
          >
            <Star size={16} className={product.isFeatured ? 'fill-warning text-warning' : ''} />
            {product.isFeatured ? 'Bỏ nổi bật' : 'Nổi bật'}
          </Button>
          <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
            <Edit size={16} />
            Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteMutation.isPending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DetailCard title="Thông tin cơ bản" icon={Package}>
            <DetailField label="Tên sản phẩm" value={product.name} />
            <DetailField label="Slug" value={product.slug} mono />
            <DetailField label="SKU" value={product.sku || 'Chưa có'} />
            <DetailField label="Thương hiệu" value={product.brand || 'Chưa có'} />
            <DetailField label="Danh mục" value={categoryName} />
            <DetailField
              label="Ngày tạo"
              value={formatDate(product.createdAt)}
            />
            <DetailField
              label="Cập nhật"
              value={formatDate(product.updatedAt)}
            />
          </DetailCard>

          <DetailCard title="Mô tả" icon={Tag}>
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {product.description || 'Chưa có mô tả sản phẩm.'}
            </p>
            {product.shortDescription && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mô tả ngắn
                </span>
                <p className="text-sm text-foreground mt-1">{product.shortDescription}</p>
              </div>
            )}
          </DetailCard>

          <DetailCard title="Hình ảnh" icon={ImageIcon}>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setPreviewImage(img); setPreviewOpen(true) }}
                    className="aspect-square rounded-lg border border-border overflow-hidden bg-muted cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ImageIcon size={32} />
                <p className="mt-2 text-sm">Chưa có hình ảnh</p>
              </div>
            )}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Giá bán" icon={DollarSign}>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Giá gốc</span>
                <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
              </div>
              {product.discountPrice ? (
                <div>
                  <span className="text-xs text-muted-foreground">Giá khuyến mãi</span>
                  <p className="text-lg font-bold text-destructive">
                    {formatPrice(product.discountPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Giảm{' '}
                    {Math.round(
                      ((product.price - product.discountPrice) / product.price) * 100
                    )}
                    %
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Không có khuyến mãi</p>
              )}
            </div>
          </DetailCard>

          <DetailCard title="Tồn kho" icon={Archive}>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Số lượng</span>
                <p
                  className={`text-lg font-bold ${
                    product.stock <= 0
                      ? 'text-destructive'
                      : product.stock <= 5
                        ? 'text-warning'
                        : 'text-foreground'
                  }`}
                >
                  {product.stock}
                </p>
              </div>
              {product.flashSale && (
                <div className="pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Flash Sale
                  </span>
                  <p className="text-sm text-foreground mt-1">
                    Giá: {formatPrice(product.flashSale.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kho: {product.flashSale.stock} | Đã bán: {product.flashSale.sold}
                  </p>
                </div>
              )}
            </div>
          </DetailCard>

          <DetailCard title="Đánh giá" icon={Star}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-warning text-warning" />
                <span className="text-lg font-bold text-foreground">
                  {product.ratingsAverage?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.ratingsQuantity || 0} đánh giá)
              </span>
            </div>
          </DetailCard>

          <DetailCard title="Thông tin bổ sung" icon={Calendar}>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="space-y-2">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{spec.key}</span>
                    <span className="text-foreground font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Không có thông số kỹ thuật</p>
            )}
          </DetailCard>
        </div>
      </div>

      <ImagePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        src={previewImage}
        alt={product.name}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityLabel="sản phẩm"
        itemName={product.name}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  )
}
