import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Tag, Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, DeleteDialog, StatusBadge, ConfirmDialog } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CategoryRow {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  createdAt?: string
}

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

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const

export default function CategoryListPage() {
  const navigate = useNavigate()
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

  const openEdit = useCallback((cat: CategoryRow) => {
    setEditingId(cat._id)
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive,
    })
    setShowModal(true)
  }, [reset])

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

  const columns: Column<CategoryRow>[] = [
    {
      header: 'Tên danh mục',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (cat) => (
        <span
          onClick={() => navigate(`/admin/categories/${cat._id}`)}
          className="font-medium text-foreground text-sm cursor-pointer hover:text-primary transition-colors"
        >
          {cat.name}
        </span>
      ),
    },
    {
      header: 'Slug',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (cat) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cat.slug}</code>,
    },
    {
      header: 'Hình ảnh',
      headerClassName: 'w-20 px-6',
      cellClassName: 'px-6 py-4',
      render: (cat) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={16} className="text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (cat) => (
        <StatusBadge variant={cat.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Ngày tạo',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-muted-foreground',
      render: (cat) => (
        <span>
          {cat.createdAt
            ? new Date(cat.createdAt).toLocaleDateString('vi-VN', DATE_FORMAT_OPTIONS)
            : '\u2014'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (cat) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => openEdit(cat)}
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteTargetId(cat._id)}
            disabled={deleteMutation.isPending}
            title="Xóa"
            className="text-destructive hover:bg-destructive-light hover:text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </Button>
        </div>
      ),
    },
  ]

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
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Có lỗi xảy ra</h3>
              <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
              <Button variant="outline" onClick={() => refetch()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                Thử lại
              </Button>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Tag} message="Không tìm thấy danh mục nào" />
        ) : (
          <DataTable columns={columns} data={categories} keyExtractor={(c) => c._id} />
        )}
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
