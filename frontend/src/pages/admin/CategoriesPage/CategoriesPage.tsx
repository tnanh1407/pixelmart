import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import CategoryTable from './CategoryTable'
import CategoryFormModal from './CategoryFormModal'

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const handleViewDetail = (cat: any) => {
    navigate(`/admin/categories/${cat._id}`)
  }

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

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', page, search],
    queryFn: () => adminService.getCategories({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string; image?: string }) => adminService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Thêm mới danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
      closeModal()
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi tạo danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; description?: string; image?: string } }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
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
      closeModal()
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Xóa danh mục thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Không thể xóa danh mục.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', description: '', image: '' })
    setShowModal(true)
  }

  const openEdit = (cat: any) => {
    setEditingId(cat._id)
    setForm({ name: cat.name, description: cat.description || '', image: cat.image || '' })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({ name: '', description: '', image: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
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
          updateMutation.mutate({ id: editingId, payload: form })
        }
      })
    } else {
      createMutation.mutate(form)
    }
  }

  const categories = data?.categories || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} danh mục</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`w-full pl-10 ${
              searchInput ? 'pr-10' : 'pr-4'
            } py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                setSearch('')
                setPage(1)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Search size={16} />
          Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onDelete={(id) => deleteMutation.mutate(id)}
          isDeleting={deleteMutation.isPending}
          pagination={pagination}
          page={page}
          setPage={setPage}
          onViewDetail={handleViewDetail}
        />
      </div>

      <CategoryFormModal
        showModal={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
