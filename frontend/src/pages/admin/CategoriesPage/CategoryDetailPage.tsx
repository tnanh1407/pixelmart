import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Tag, Calendar, Info, Loader2, Edit } from 'lucide-react'
import { categoryService } from '@/services/category.service'
import { adminService } from '@/services/admin/admin.service'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import CategoryFormModal from './CategoryFormModal'

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Edit Modal States
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isUploading, setIsUploading] = useState(false)

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['admin-category-detail', id],
    queryFn: () => categoryService.getCategoryById(id || ''),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { name?: string; description?: string; image?: string }) =>
      adminService.updateCategory(id || '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-category-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
      setShowModal(false)
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi cập nhật danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCategoryImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
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
    Swal.fire({
      title: 'Xác nhận cập nhật?',
      text: 'Bạn có chắc chắn muốn lưu các thay đổi cho danh mục này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6 !ml-2',
        cancelButton: '!rounded-lg !px-6',
        actions: '!gap-2',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateMutation.mutate(form)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Tag size={48} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy danh mục</h3>
        <p className="text-gray-500 mt-1">Đã có lỗi xảy ra hoặc danh mục không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/categories')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
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
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết danh mục</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý và xem thông tin chi tiết danh mục</p>
          </div>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Edit size={16} />
          Chỉnh sửa danh mục
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="p-6 space-y-6">
          {category.image ? (
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Tag size={32} className="mb-2" />
              <span className="text-xs">Không có hình ảnh</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên danh mục</span>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{category.name}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả danh mục</span>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[80px]">
                {category.description || 'Chưa có thông tin mô tả chi tiết cho danh mục này.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Trạng thái</span>
                <Badge
                  variant={category.isActive ? 'default' : 'destructive'}
                  className={`mt-1.5 px-3 py-1 text-xs font-semibold shadow-none border-none ${
                    category.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-700' : ''
                  }`}
                >
                  {category.isActive ? 'Đang hoạt động' : 'Đang ẩn'}
                </Badge>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ID danh mục</span>
                <p className="text-xs font-mono text-gray-500 mt-1.5 select-all">{category._id}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Ngày tạo danh mục</span>
                  <span>{category.createdAt ? new Date(category.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Cập nhật lần cuối</span>
                  <span>{category.updatedAt ? new Date(category.updatedAt).toLocaleString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
          >
            Quay lại
          </button>
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
    </div>
  )
}
