import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Upload, X, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { LoadingState, SectionCard } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const campaignSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().optional(),
  type: z.enum(['promotion', 'blog']),
  description: z.string().optional(),
  sourceUrl: z.string().optional(),
  order: z.coerce.number().int('Phải là số nguyên').min(0, 'Phải lớn hơn hoặc bằng 0'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
})

type CampaignFormData = z.infer<typeof campaignSchema>

const isEditing = (id?: string) => id && id !== 'create'

export default function CampaignFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const editMode = isEditing(id)

  const { data: campaign, isLoading: loadingCampaign } = useQuery({
    queryKey: ['admin-campaign-detail', id],
    queryFn: () => adminService.getCampaigns({ page: 1, limit: 1, search: id }),
    enabled: editMode,
    select: (res) => res.campaigns?.[0],
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      slug: '',
      type: 'promotion',
      description: '',
      sourceUrl: '',
      order: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  })

  const watchedTitle = watch('title')
  const watchedSourceUrl = watch('sourceUrl')

  useEffect(() => {
    if (!editMode && watchedTitle) {
      const generated = watchedTitle
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
      setValue('slug', generated, { shouldValidate: false })
    }
  }, [watchedTitle, editMode, setValue])

  useEffect(() => {
    if (campaign && editMode) {
      reset({
        title: (campaign as any).title || '',
        slug: (campaign as any).slug || '',
        type: (campaign as any).type || 'promotion',
        description: (campaign as any).description || '',
        sourceUrl: (campaign as any).sourceUrl || '',
        order: (campaign as any).order || 0,
        startDate: (campaign as any).startDate
          ? (campaign as any).startDate.substring(0, 10)
          : '',
        endDate: (campaign as any).endDate
          ? (campaign as any).endDate.substring(0, 10)
          : '',
        isActive: (campaign as any).isActive ?? true,
      })
      setImageUrl((campaign as any).image || (campaign as any).sourceUrl || '')
    }
  }, [campaign, editMode, reset])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })
    queryClient.invalidateQueries({ queryKey: ['admin-campaign-detail'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminService.createCampaign(payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tạo chiến dịch thành công')
      navigate('/admin/campaigns')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo chiến dịch')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: any) => adminService.updateCampaign(id!, { ...payload, _id: undefined }),
    onSuccess: () => {
      invalidate()
      toast.success('Cập nhật chiến dịch thành công')
      navigate('/admin/campaigns')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật chiến dịch')
    },
  })

  const onSubmit = (data: CampaignFormData) => {
    const payload = {
      title: data.title,
      slug: data.slug || undefined,
      type: data.type,
      description: data.description || undefined,
      sourceUrl: imageUrl || data.sourceUrl || undefined,
      image: imageUrl || undefined,
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
      const url = await adminService.uploadCampaignImage(file)
      setImageUrl(url)
      setValue('sourceUrl', url)
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting

  if (editMode && loadingCampaign) {
    return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/campaigns')}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? 'Chỉnh sửa chiến dịch' : 'Thêm chiến dịch mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? `Đang chỉnh sửa: ${(campaign as any)?.title}` : 'Nhập thông tin chiến dịch mới'}
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
                placeholder="Nhập tiêu đề chiến dịch..."
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="tu-dong-tao-tu-tieu-de..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Loại chiến dịch</Label>
                <select
                  id="type"
                  {...register('type')}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="promotion">Khuyến mãi</option>
                  <option value="blog">Bài viết</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className={cn(
                  'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm resize-none',
                  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none',
                  'placeholder:text-muted-foreground',
                )}
                placeholder="Nhập mô tả chiến dịch..."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Hình ảnh">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Input
                placeholder="URL hình ảnh..."
                value={watchedSourceUrl || ''}
                onChange={(e) => setValue('sourceUrl', e.target.value)}
                className="flex-1"
              />
              <label className={cn(
                'inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors shrink-0',
                'hover:border-primary hover:bg-primary/5',
                uploading && 'opacity-50 cursor-not-allowed',
              )}>
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                <span className="hidden sm:inline">Tải ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {(imageUrl || watchedSourceUrl) && (
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={imageUrl || watchedSourceUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); setValue('sourceUrl', '') }}
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
            onClick={() => navigate('/admin/campaigns')}
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
                {editMode ? 'Cập nhật chiến dịch' : 'Tạo chiến dịch'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
