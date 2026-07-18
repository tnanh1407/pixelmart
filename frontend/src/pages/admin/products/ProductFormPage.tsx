import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Upload, X, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IProduct } from '@/types/product.types'
import { LoadingState } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number({ invalid_type_error: 'Giá phải là số' })
    .min(1000, 'Giá phải lớn hơn hoặc bằng 1000'),
  discountPrice: z.coerce.number({ invalid_type_error: 'Giá phải là số' })
    .optional()
    .nullable()
    .transform((v) => v || null),
  stock: z.coerce.number({ invalid_type_error: 'Số lượng phải là số' })
    .int('Số lượng phải là số nguyên')
    .min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  storeId: z.string().optional(),
  brand: z.string().optional(),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productSchema>

interface CategoryOption {
  _id: string
  name: string
}

const isEditing = (id?: string) => id && id !== 'create'

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const editMode = isEditing(id)

  const { data: product, isLoading: loadingProduct } = useQuery<IProduct>({
    queryKey: ['admin-product-detail', id],
    queryFn: () => adminService.getProductById(id!),
    enabled: editMode,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: () => adminService.getCategories({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  })

  const categories: CategoryOption[] = categoriesData?.categories || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      discountPrice: null,
      stock: 0,
      categoryId: '',
      storeId: '',
      brand: '',
      tags: '',
      isActive: true,
      isFeatured: false,
    },
  })

  useEffect(() => {
    if (product && editMode) {
      const tags = product.specifications
        ?.filter((s) => s.key === 'tags')
        .map((s) => s.value)
        .join(', ') || ''

      reset({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || 0,
        discountPrice: product.discountPrice ?? null,
        stock: product.stock || 0,
        categoryId:
          typeof product.categoryId === 'object' && product.categoryId !== null
            ? (product.categoryId as { _id: string })._id
            : product.categoryId || '',
        storeId:
          typeof product.storeId === 'object' && product.storeId !== null
            ? (product.storeId as { _id: string })._id
            : product.storeId || '',
        brand: product.brand || '',
        tags,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
      })
      setImages(product.images || [])
    }
  }, [product, editMode, reset])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    queryClient.invalidateQueries({ queryKey: ['admin-product-detail'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: Partial<IProduct>) => adminService.createProduct(payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tạo sản phẩm thành công')
      navigate('/admin/products')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo sản phẩm')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<IProduct>) => adminService.updateProduct(id!, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Cập nhật sản phẩm thành công')
      navigate(`/admin/products/${id}`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật sản phẩm')
    },
  })

  const onSubmit = (data: ProductFormData) => {
    const payload: Partial<IProduct> = {
      name: data.name,
      slug: data.slug || undefined,
      description: data.description || undefined,
      shortDescription: data.shortDescription || undefined,
      price: data.price,
      discountPrice: data.discountPrice || undefined,
      stock: data.stock,
      categoryId: data.categoryId,
      storeId: data.storeId || undefined,
      brand: data.brand || undefined,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images,
    }

    if (editMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const url = await adminService.uploadProductImage(file)
      setImages((prev) => [...prev, url])
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting

  if (editMode && loadingProduct) {
    return <LoadingState className="min-h-[400px]" type="skeleton" rows={8} />
  }

  if (editMode && !product && !loadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-lg font-semibold text-foreground">Không tìm thấy sản phẩm</h3>
        <Button onClick={() => navigate('/admin/products')} className="mt-4">
          <ArrowLeft size={16} />
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? `Đang chỉnh sửa: ${product?.name}` : 'Nhập thông tin sản phẩm mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Nhập tên sản phẩm..."
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="tu-dong-tao-tu-ten..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                      id="brand"
                      {...register('brand')}
                      placeholder="Nhập thương hiệu..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={5}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                  <textarea
                    id="shortDescription"
                    {...register('shortDescription')}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    placeholder="Mô tả ngắn (hiển thị trong danh sách)..."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Hình ảnh</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square w-24 rounded-lg border border-border overflow-hidden bg-muted">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square w-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors bg-muted/50">
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload size={20} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Tải ảnh</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImage}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Giá & Kho</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">
                    Giá gốc <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price')}
                    placeholder="0"
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    {...register('discountPrice')}
                    placeholder="Để trống nếu không có"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock">
                    Số lượng tồn kho <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register('stock')}
                    placeholder="0"
                    className={errors.stock ? 'border-destructive' : ''}
                  />
                  {errors.stock && (
                    <p className="text-xs text-destructive mt-1">{errors.stock.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Phân loại</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="categoryId">
                    Danh mục <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="categoryId"
                    {...register('categoryId')}
                    className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="storeId">Cửa hàng</Label>
                  <Input
                    id="storeId"
                    {...register('storeId')}
                    placeholder="ID cửa hàng (tùy chọn)"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="tag1, tag2, tag3..."
                  />
                  <p className="text-xs text-muted-foreground">Phân cách bằng dấu phẩy</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Trạng thái</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="size-4 accent-primary rounded border-border"
                  />
                  <span className="text-sm text-foreground font-medium">Hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="size-4 accent-primary rounded border-border"
                  />
                  <span className="text-sm text-foreground font-medium">Nổi bật</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {editMode ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {editMode ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
