import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Tag, Loader2, Edit, Clock, Image as ImageIcon, Info } from 'lucide-react'
import { categoryService } from '@/services/user/category.service'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
import { StatusBadge, StatusToggle, ConfirmDialog, LoadingState, DetailCard, DetailField, ImagePreview } from '@/components/admin/shared'
import CategoryFormModal from './CategoryFormModal'

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
    setForm({ name: category.name, description: category.description || '', image: category.image || '' })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setShowConfirmDialog(true)
  }

  const handleConfirmUpdate = () => {
    updateMutation.mutate({ id: id || '', payload: form }, {
      onSuccess: () => { setShowModal(false); setShowConfirmDialog(false) },
    })
  }

  if (isLoading) return <LoadingState className="min-h-[400px]" />

  if (error || !category) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Tag size={48} className="mx-auto text-text-muted mb-3" />
        <h3 className="text-lg font-semibold text-text">Không tìm thấy danh mục</h3>
        <p className="text-text-muted mt-1">Đã có lỗi xảy ra hoặc danh mục không tồn tại.</p>
        <button onClick={() => navigate('/admin/categories')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/categories')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{category.name}</h1>
              <StatusBadge active={category.isActive} />
            </div>
            <p className="text-sm text-text-muted mt-1">ID: {category._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusToggle active={category.isActive} onChange={(a) => toggleActiveMutation.mutate({ id: id || '', isActive: !a })} />
          <button onClick={openEdit}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm">
            <Edit size={16} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailCard title="Hình ảnh danh mục" icon={ImageIcon}>
            {category.image ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setPreviewImage({ src: category.image!, alt: category.name })} />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-text-muted">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <span className="text-sm">Chưa có hình ảnh</span>
              </div>
            )}
          </DetailCard>

          <DetailCard title="Mô tả danh mục" icon={Info}>
            <p className="text-base text-text leading-relaxed whitespace-pre-line">
              {category.description || 'Chưa có thông tin mô tả chi tiết cho danh mục này.'}
            </p>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Thông tin nhanh" icon={Tag}>
            <div className="space-y-3">
              <DetailField label="Tên danh mục" value={category.name} />
              <DetailField label="Trạng thái" value={<span className={category.isActive ? 'text-green-600' : 'text-gray-500'}>{category.isActive ? 'Hoạt động' : 'Ẩn'}</span>} />
              <DetailField label="ID" value={category._id} mono />
            </div>
          </DetailCard>

          <DetailCard title="Thời gian" icon={Clock}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-text-muted">Ngày tạo</p>
                  <p className="text-sm font-medium text-text">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '\u2014'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-text-muted">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-text">
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '\u2014'}
                  </p>
                </div>
              </div>
            </div>
          </DetailCard>
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

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Xác nhận cập nhật?"
        description="Bạn có chắc chắn muốn lưu các thay đổi cho danh mục này?"
        onConfirm={handleConfirmUpdate}
      />

      <ImagePreview
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        src={previewImage?.src}
        alt={previewImage?.alt}
      />
    </div>
  )
}
