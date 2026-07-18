import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Tag, Loader2, Edit, Clock, Image as ImageIcon, Info } from 'lucide-react'
import { categoryService } from '@/services/category.service'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
import ImagePreviewDialog from '@/components/ui/image-preview-dialog'
import { Badge } from '@/components/ui/badge'
import CategoryFormModal from './CategoryFormModal'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isUploading, setIsUploading] = useState(false)

  const { updateMutation, toggleActiveMutation } = useAdminCategoryMutations({ detailId: id })

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['admin-category-detail', id],
    queryFn: () => categoryService.getCategoryById(id || ''),
    enabled: !!id,
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCategoryImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('Tải ảnh lên thành công', { id: toastId, closeButton: true })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId, closeButton: true })
    } finally {
      setIsUploading(false)
    }
  }

  const openEdit = () => {
    if (!category) return
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setShowConfirmDialog(true)
  }

  const handleConfirmUpdate = () => {
    updateMutation.mutate({ id: id || '', payload: form }, {
      onSuccess: () => {
        setShowModal(false)
        setShowConfirmDialog(false)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Tag size={48} className="mx-auto text-text-muted mb-3" />
        <h3 className="text-lg font-semibold text-text">Không tìm thấy danh mục</h3>
        <p className="text-text-muted mt-1">Đã có lỗi xảy ra hoặc danh mục không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/categories')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/categories')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{category.name}</h1>
              <Badge
                variant={category.isActive ? 'default' : 'destructive'}
                className={`px-3 py-1 text-xs font-semibold shadow-none border-none ${
                  category.isActive ? 'bg-green-500/10 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
              </Badge>
            </div>
            <p className="text-sm text-text-muted mt-1">ID: {category._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleActiveMutation.mutate({ id: id || '', isActive: category.isActive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
              category.isActive ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                category.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <button
            onClick={openEdit}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm"
          >
            <Edit size={16} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Hình ảnh danh mục</h2>
              </div>
            </div>
            <div className="p-4">
              {category.image ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setPreviewImage({ src: category.image!, alt: category.name })}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-text-muted">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-sm">Chưa có hình ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Mô tả danh mục</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-base text-text leading-relaxed whitespace-pre-line">
                {category.description || 'Chưa có thông tin mô tả chi tiết cho danh mục này.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Thông tin nhanh</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Tên danh mục</span>
                <span className="text-sm font-medium text-text">{category.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Trạng thái</span>
                <span className={`text-sm font-medium ${category.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {category.isActive ? 'Hoạt động' : 'Ẩn'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">ID</span>
                <span className="text-xs font-mono text-text-muted bg-gray-100 px-2 py-1 rounded">{category._id}</span>
              </div>
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Thời gian</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-text-muted">Ngày tạo</p>
                  <p className="text-sm font-medium text-text">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-text-muted">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-text">
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CategoryFormModal
        showModal={showModal}
        editingId={id || null}
        form={form}
        setForm={setForm}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)}
        isPending={updateMutation.isPending}
      />

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn lưu các thay đổi cho danh mục này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        src={previewImage?.src}
        alt={previewImage?.alt}
      />
    </div>
  )
}
