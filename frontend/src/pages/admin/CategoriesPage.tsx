import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAdminCategoryMutations } from '@/hooks/admin/categories/useAdminCategoryMutations'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, CopyButton, DeleteDialog, ConfirmDialog } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import CategoryFormModal from './CategoryFormModal'

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
}

export default function CategoriesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isUploading, setIsUploading] = useState(false)

  const { createMutation, updateMutation, deleteMutation, toggleActiveMutation } = useAdminCategoryMutations()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', page, search],
    queryFn: () => adminService.getCategories({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
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
      setShowConfirmDialog(true)
    } else {
      createMutation.mutate(form, { onSuccess: () => closeModal() })
    }
  }

  const handleConfirmUpdate = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: form }, {
        onSuccess: () => { closeModal(); setShowConfirmDialog(false) },
      })
    }
  }

  const categories: Category[] = data?.categories || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const columns: Column<Category>[] = [
    {
      header: 'Mã định danh',
      headerClassName: 'w-25 px-6',
      cellClassName: 'px-6 py-4 text-xs text-text-muted',
      render: (cat) => (
        <div className="flex items-center gap-1.5">
          <span>{cat._id}</span>
          <CopyButton text={cat._id} />
        </div>
      ),
    },
    {
      header: 'Hình ảnh',
      headerClassName: 'w-25 px-6',
      cellClassName: 'px-6 py-4',
      render: (cat) => (
        <div onClick={() => navigate(`/admin/categories/${cat._id}`)} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag size={16} className="text-text-muted" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Tên danh mục',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 font-medium text-text text-sm cursor-pointer hover:text-primary transition-colors',
      render: (cat) => (
        <span onClick={() => navigate(`/admin/categories/${cat._id}`)}>{cat.name}</span>
      ),
    },
    {
      header: 'Mô tả',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-text-muted max-w-xs truncate',
      render: (cat) => cat.description || '\u2014',
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6 text-center',
      cellClassName: 'px-6 py-4 text-center',
      render: (cat) => (
        <button
          type="button"
          onClick={() => toggleActiveMutation.mutate({ id: cat._id, isActive: cat.isActive })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${cat.isActive ? 'bg-primary' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${cat.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (cat) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setDeleteTargetId(cat._id)}
            disabled={deleteMutation.isPending}
            className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            title="Xóa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
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
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer">
            <Plus size={18} />
            Thêm danh mục
          </button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm danh mục..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput); setPage(1) }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : categories.length === 0 ? (
          <EmptyState icon={Tag} message="Không tìm thấy danh mục nào" />
        ) : (
          <DataTable columns={columns} data={categories} keyExtractor={(c) => c._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
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

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Xác nhận cập nhật?"
        description="Bạn có chắc chắn muốn lưu các thay đổi cho danh mục này?"
        onConfirm={handleConfirmUpdate}
      />

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="danh mục"
        onConfirm={() => {
          if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) }
        }}
      />
    </div>
  )
}
