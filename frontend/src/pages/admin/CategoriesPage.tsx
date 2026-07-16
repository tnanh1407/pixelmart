import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, Trash2, Edit, Plus, X, Loader2, Tag, Upload } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isUploading, setIsUploading] = useState(false)

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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Không tìm thấy danh mục nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Hình ảnh</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tên danh mục</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Mô tả</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat: any) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag size={16} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cat.isActive ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: 'Xác nhận xóa?',
                              text: 'Bạn có chắc chắn muốn xóa danh mục này? Thao tác này không thể hoàn tác.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#ef4444',
                              cancelButtonColor: '#6b7280',
                              confirmButtonText: 'Đồng ý xóa',
                              cancelButtonText: 'Hủy',
                              customClass: {
                                popup: '!rounded-xl',
                                confirmButton: '!rounded-lg !px-6 !ml-2',
                                cancelButton: '!rounded-lg !px-6',
                                actions: '!gap-2',
                              }
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteMutation.mutate(cat._id)
                              }
                            })
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh danh mục</label>
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="URL ảnh hoặc tải ảnh lên"
                    />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
                      isUploading
                        ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-600'
                    }`}>
                      {isUploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      <span>Tải ảnh lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {form.image && (
                    <div className="relative aspect-[16/9] w-full max-w-[150px] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={form.image} alt="Category Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Nhập mô tả (tùy chọn)"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
