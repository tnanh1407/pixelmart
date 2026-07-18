import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { IVoucher } from '@/types/voucher.types'
import { LoadingState, SectionCard } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const voucherSchema = z.object({
  code: z.string().min(1, 'Mã voucher không được để trống'),
  name: z.string().min(1, 'Tên voucher không được để trống'),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number({ invalid_type_error: 'Giá trị phải là số' })
    .min(1, 'Giá trị phải lớn hơn 0'),
  minOrderValue: z.coerce.number({ invalid_type_error: 'Phải là số' })
    .min(0, 'Phải lớn hơn hoặc bằng 0')
    .default(0),
  maxDiscount: z.coerce.number({ invalid_type_error: 'Phải là số' })
    .optional()
    .nullable()
    .transform((v) => v || null),
  scope: z.enum(['platform', 'store']),
  storeId: z.string().optional(),
  usageLimit: z.coerce.number({ invalid_type_error: 'Phải là số' })
    .int('Phải là số nguyên')
    .min(1, 'Phải lớn hơn hoặc bằng 1'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
})

type VoucherFormData = z.infer<typeof voucherSchema>

const isEditing = (id?: string) => id && id !== 'create'

export default function VoucherFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const editMode = isEditing(id)

  const { data: voucher, isLoading: loadingVoucher } = useQuery<IVoucher>({
    queryKey: ['admin-voucher-detail', id],
    queryFn: () => adminService.getVoucherById(id!),
    enabled: editMode,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      minOrderValue: 0,
      maxDiscount: null,
      scope: 'platform',
      storeId: '',
      usageLimit: 100,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  })

  const watchedScope = watch('scope')
  const watchedType = watch('type')

  useEffect(() => {
    if (voucher && editMode) {
      reset({
        code: voucher.code || '',
        name: voucher.name || '',
        type: voucher.type || 'percentage',
        value: voucher.value || 0,
        minOrderValue: voucher.minOrderValue || 0,
        maxDiscount: voucher.maxDiscount ?? null,
        scope: voucher.scope || 'platform',
        storeId: typeof voucher.storeId === 'object' && voucher.storeId !== null
          ? (voucher.storeId as { _id: string })._id
          : voucher.storeId || '',
        usageLimit: voucher.usageLimit || 100,
        startDate: voucher.startDate ? voucher.startDate.substring(0, 16) : '',
        endDate: voucher.endDate ? voucher.endDate.substring(0, 16) : '',
        isActive: voucher.isActive ?? true,
      })
    }
  }, [voucher, editMode, reset])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] })
    queryClient.invalidateQueries({ queryKey: ['admin-voucher-detail'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: Partial<IVoucher>) => adminService.createVoucher(payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tạo voucher thành công')
      navigate('/admin/vouchers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo voucher')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<IVoucher>) => adminService.updateVoucher(id!, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Cập nhật voucher thành công')
      navigate('/admin/vouchers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật voucher')
    },
  })

  const onSubmit = (data: VoucherFormData) => {
    const payload: Partial<IVoucher> = {
      code: data.code.toUpperCase(),
      name: data.name,
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue,
      maxDiscount: data.maxDiscount,
      scope: data.scope,
      storeId: data.scope === 'store' ? data.storeId || undefined : undefined,
      usageLimit: data.usageLimit,
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

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting

  if (editMode && loadingVoucher) {
    return <LoadingState className="min-h-[400px]" type="skeleton" rows={6} />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/vouchers')}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editMode ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? `Đang chỉnh sửa: ${voucher?.name}` : 'Nhập thông tin voucher mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <SectionCard title="Thông tin cơ bản">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">
                  Mã voucher <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="Ví dụ: SALE50"
                  className={errors.code ? 'border-destructive' : ''}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase()
                  }}
                />
                {errors.code && (
                  <p className="text-xs text-destructive mt-1">{errors.code.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Tên voucher <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ví dụ: Giảm 50% đơn hàng"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type">Loại giảm giá</Label>
                <select
                  id="type"
                  {...register('type')}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Cố định (VNĐ)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">
                  Giá trị <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  {...register('value')}
                  placeholder={watchedType === 'percentage' ? '10' : '50000'}
                  className={errors.value ? 'border-destructive' : ''}
                />
                {errors.value && (
                  <p className="text-xs text-destructive mt-1">{errors.value.message}</p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Điều kiện áp dụng">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minOrderValue">Đơn hàng tối thiểu</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  {...register('minOrderValue')}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxDiscount">Giảm tối đa</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  {...register('maxDiscount')}
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="usageLimit">
                Số lượng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="usageLimit"
                type="number"
                {...register('usageLimit')}
                placeholder="100"
                className={errors.usageLimit ? 'border-destructive' : ''}
              />
              {errors.usageLimit && (
                <p className="text-xs text-destructive mt-1">{errors.usageLimit.message}</p>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Phạm vi & Thời gian">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="scope">Phạm vi</Label>
                <select
                  id="scope"
                  {...register('scope')}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="platform">Toàn hệ thống</option>
                  <option value="store">Theo cửa hàng</option>
                </select>
              </div>
              {watchedScope === 'store' && (
                <div className="space-y-1.5">
                  <Label htmlFor="storeId">ID cửa hàng</Label>
                  <Input
                    id="storeId"
                    {...register('storeId')}
                    placeholder="Nhập ID cửa hàng..."
                  />
                </div>
              )}
            </div>

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
            onClick={() => navigate('/admin/vouchers')}
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
                {editMode ? 'Cập nhật Voucher' : 'Tạo Voucher'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
