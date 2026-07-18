import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { LoadingState, SectionCard } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const flashSaleSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['scheduled', 'active', 'ended', 'cancelled']),
})

type FlashSaleFormData = z.infer<typeof flashSaleSchema>

const isEditing = (id?: string) => id && id !== 'create'

export default function FlashSaleFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const editMode = isEditing(id)

  const { data: flashSale, isLoading: loadingFlashSale } = useQuery({
    queryKey: ['admin-flash-sale-detail', id],
    queryFn: () => adminService.getFlashSaleById(id!),
    enabled: editMode,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FlashSaleFormData>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'scheduled',
    },
  })

  useEffect(() => {
    if (flashSale && editMode) {
      reset({
        name: flashSale.name || '',
        description: flashSale.description || '',
        startDate: flashSale.startDate ? flashSale.startDate.substring(0, 16) : '',
        endDate: flashSale.endDate ? flashSale.endDate.substring(0, 16) : '',
        status: flashSale.status || 'scheduled',
      })
    }
  }, [flashSale, editMode, reset])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] })
    queryClient.invalidateQueries({ queryKey: ['admin-flash-sale-detail'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminService.createFlashSale(payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tạo flash sale thành công')
      navigate('/admin/flash-sales')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo flash sale')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: any) => adminService.updateFlashSale(id!, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Cập nhật flash sale thành công')
      navigate('/admin/flash-sales')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật flash sale')
    },
  })

  const onSubmit = (data: FlashSaleFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      status: data.status,
    }

    if (editMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting

  if (editMode && loadingFlashSale) {
    return <LoadingState className="min-h-[400px]" type="skeleton" rows={4} />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/flash-sales')}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? `Đang chỉnh sửa: ${flashSale?.name}` : 'Nhập thông tin chương trình flash sale mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <SectionCard title="Thông tin chương trình">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Tên chương trình <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ví dụ: Flash Sale Thứ 6 Đen Tối..."
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none placeholder:text-muted-foreground"
                placeholder="Mô tả ngắn về chương trình flash sale..."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thời gian & Trạng thái">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register('startDate')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register('endDate')}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                {...register('status')}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                <option value="scheduled">Sắp diễn ra</option>
                <option value="active">Đang diễn ra</option>
                <option value="ended">Đã kết thúc</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/flash-sales')}
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
                {editMode ? 'Cập nhật Flash Sale' : 'Tạo Flash Sale'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
