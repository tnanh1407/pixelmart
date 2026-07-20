import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Loader2, Upload, X } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
import { PageHeader, SearchToolbar, Pagination, DeleteDialog, ConfirmDialog } from '@/components/admin/shared'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import CategoryTable, { type CategoryRow } from './CategoryTable'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

const defaultFormValues: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
}

export default function CategoryListPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<CategoryFormData | null>(null)

  const { createMutation, updateMutation, deleteMutation } = useAdminCategoryMutations()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultFormValues,
  })

  const watchedName = watch('name')
  const watchedImage = watch('image')

  useEffect(() => {
    if (!editingId && watchedName) {
      const generated = watchedName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
      setValue('slug', generated, { shouldValidate: false })
    }
  }, [watchedName, editingId, setValue])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-categories', page, search],
    queryFn: () => adminService.getCategories({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const isFormPending = createMutation.isPending || updateMutation.isPending || isUploading

  const openCreate = useCallback(() => {
    setEditingId(null)
    reset(defaultFormValues)
    setShowModal(true)
  }, [reset])

  // const openEdit = useCallback((cat: CategoryRow) => {
  //   setEditingId(cat._id)
  //   reset({
  //     name: cat.name,
  //     slug: cat.slug,
  //     description: cat.description || '',
  //     image: cat.image || '',
  //     isActive: cat.isActive,
  //   })
  //   setShowModal(true)
  // }, [reset])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setEditingId(null)
    reset(defaultFormValues)
    setPendingFormData(null)
  }, [reset])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCategoryImage(file)
      setValue('image', imageUrl)
      toast.success('Tải ảnh lên thành công', { id: toastId, closeButton: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId, closeButton: true })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onFormSubmit = (data: CategoryFormData) => {
    if (editingId) {
      setPendingFormData(data)
      setConfirmOpen(true)
    } else {
      createMutation.mutate(
        { name: data.name, description: data.description || undefined, image: data.image || undefined },
        { onSuccess: () => closeModal() },
      )
    }
  }

  const handleConfirmUpdate = () => {
    if (editingId && pendingFormData) {
      updateMutation.mutate(
        {
          id: editingId,
          payload: {
            name: pendingFormData.name,
            description: pendingFormData.description || undefined,
            image: pendingFormData.image || undefined,
          },
        },
        {
          onSuccess: () => { closeModal(); setConfirmOpen(false) },
          onError: () => setConfirmOpen(false),
        },
      )
    }
  }

  const categories: CategoryRow[] = (data?.categories || []) as CategoryRow[]
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <PageHeader
        title="Quản lý danh mục"
        description={`Tổng: ${pagination.total} danh mục`}
        action={
          <Button onClick={openCreate}>
            <Plus size={18} />
            Thêm danh mục
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm danh mục..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput); setPage(1) }}
      />

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onDelete={setDeleteTargetId}
          isDeleting={deleteMutation.isPending}
        />
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <Dialog open={showModal} onOpenChange={(open) => { if (!open) closeModal() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input id="name" placeholder="Nhập tên danh mục" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="slug-cua-danh-muc" {...register('slug')} />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              {!editingId && (
                <p className="text-xs text-muted-foreground">Tự động tạo từ tên danh mục</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Hình ảnh</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="URL ảnh hoặc tải ảnh lên"
                  value={watchedImage || ''}
                  onChange={(e) => setValue('image', e.target.value, { shouldValidate: true })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="hidden sm:inline">Tải lên</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>
              {watchedImage && (
                <div className="relative aspect-video w-full max-w-[200px] rounded-lg overflow-hidden border border-border bg-muted">
                  <img src={watchedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setValue('image', '')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-foreground/60 hover:bg-foreground/80 text-background transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Nhập mô tả (tùy chọn)"
                {...register('description')}
                className={cn(
                  'w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none',
                  'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                  'resize-none md:text-sm',
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="isActive" className="mb-0 cursor-pointer">Trạng thái hoạt động</Label>
              <button
                type="button"
                id="isActive"
                role="switch"
                aria-checked={watch('isActive')}
                onClick={() => setValue('isActive', !watch('isActive'))}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer',
                  watch('isActive') ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out',
                    watch('isActive') ? 'translate-x-6' : 'translate-x-1',
                  )}
                />
              </button>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit" disabled={isFormPending || isSubmitting}>
                {(isFormPending || isSubmitting) && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận cập nhật?"
        description="Bạn có chắc chắn muốn lưu các thay đổi cho danh mục này?"
        onConfirm={handleConfirmUpdate}
      />

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}
        entityLabel="danh mục"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) })
          }
        }}
      />
    </div>
  )
}
