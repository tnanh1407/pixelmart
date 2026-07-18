import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Upload, X, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IBanner } from '@/types/banner.types'
import { LoadingState, SectionCard } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const bannerSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  targetUrl: z.string().optional(),
  position: z.enum(['home_top', 'home_middle', 'sidebar', 'popup']),
  type: z.enum(['slider', 'static', 'promo_card']),
  order: z.coerce.number().int('Phải là số nguyên').min(0, 'Phải lớn hơn hoặc bằng 0'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
})

type BannerFormData = z.infer<typeof bannerSchema>

const isEditing = (id?: string) => id && id !== 'create'

export default function BannerFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const editMode = isEditing(id)

  const { data: banner, isLoading: loadingBanner } = useQuery<IBanner>({
    queryKey: ['admin-banner-detail', id],
    queryFn: () => adminService.getBannerById(id!),
    enabled: editMode,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      targetUrl: '',
      position: 'home_top',
      type: 'slider',
      order: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (banner && editMode) {
      reset({
        title: banner.title || '',
        targetUrl: banner.targetUrl || '',
        position: banner.position || 'home_top',
        type: banner.type || 'slider',
        order: banner.order || 0,
        startDate: banner.startDate ? banner.startDate.substring(0, 10) : '',
        endDate: banner.endDate ? banner.endDate.substring(0, 10) : '',
        isActive: banner.isActive ?? true,
      })
      setImageUrl(banner.image || '')
    }
  }, [banner, editMode, reset])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
    queryClient.invalidateQueries({ queryKey: ['admin-banner-detail'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: Partial<IBanner>) => adminService.createBanner(payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tạo banner thành công')
      navigate('/admin/banners')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo banner')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<IBanner>) => adminService.updateBanner(id!, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Cập nhật banner thành công')
      navigate('/admin/banners')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật banner')
    },
  })

  const onSubmit = (data: BannerFormData) => {
    const payload: Partial<IBanner> = {
      title: data.title,
      image: imageUrl,
      targetUrl: data.targetUrl || undefined,
      position: data.position,
      type: data.type,
      order: data.order,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      isActive: data.isActive,
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
      const result = await adminService.uploadBannerImage(file)
      const url = typeof result === 'string' ? result : result.url
      setImageUrl(url)
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting

  if (editMode && loadingBanner) {
    return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/banners')}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? `Đang chỉnh sửa: ${banner?.title}` : 'Nhập thông tin banner mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <SectionCard title="Thông tin cơ bản">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Nhập tiêu đề banner..."
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetUrl">Đường dẫn</Label>
              <Input
                id="targetUrl"
                {...register('targetUrl')}
                placeholder="https://example.com..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="position">Vị trí</Label>
                <select
                  id="position"
                  {...register('position')}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="home_top">Đầu trang chủ</option>
                  <option value="home_middle">Giữa trang chủ</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Loại banner</Label>
                <select
                  id="type"
                  {...register('type')}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="slider">Slider</option>
                  <option value="static">Tĩnh</option>
                  <option value="promo_card">Promo Card</option>
                </select>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Hình ảnh">
          <div className="space-y-3">
            <label className={cn(
              'inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5',
              uploading && 'opacity-50 cursor-not-allowed',
            )}>
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              <span>Tải ảnh lên</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {imageUrl && (
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Cấu hình">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="order">
                  Thứ tự <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  {...register('order')}
                  placeholder="0"
                  className={errors.order ? 'border-destructive' : ''}
                />
                {errors.order && (
                  <p className="text-xs text-destructive mt-1">{errors.order.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="size-4 accent-primary rounded border-border"
              />
              <Label htmlFor="isActive" className="mb-0 cursor-pointer font-medium">
                Hoạt động
              </Label>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/banners')}
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
                {editMode ? 'Cập nhật Banner' : 'Tạo Banner'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
