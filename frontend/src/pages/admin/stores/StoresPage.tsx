import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Store } from 'lucide-react'
import { adminService, type StoreListResponse } from '@/services/admin/admin.service'
import { useAdminStoreMutations } from '@/hooks/admin/stores'
import { PageHeader, SearchToolbar, Pagination, LoadingState, EmptyState, DeleteDialog } from '@/components/admin/shared'
import StoreFormModal from './StoreFormModal'
import StoreTable from './StoreTable'
import type { AdminStoreForm } from '@/hooks/admin/stores'

export default function StoresPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminStoreForm>({
    name: '', logo: '', description: '', phone: '', email: '',
    address: { street: '', ward: '', district: '', city: '' },
    isVerified: false, isActive: true, ownerId: '',
  })

  const { data, isLoading } = useQuery<StoreListResponse>({
    queryKey: ['admin-stores', page, search],
    queryFn: () => adminService.getStores({ page, limit: 10, search: search || undefined, all: true } as any),
    staleTime: 30 * 1000,
  })

  const stores = data?.stores || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
  const { createStoreMutation, updateStoreMutation, deleteMutation } = useAdminStoreMutations({ stores })

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', logo: '', description: '', phone: '', email: '', address: { street: '', ward: '', district: '', city: '' }, isVerified: false, isActive: true, ownerId: '' })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingId(null) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.ownerId) return
    const cleanOwnerId = typeof form.ownerId === 'object' && form.ownerId !== null ? (form.ownerId as any)._id : form.ownerId
    const cleanForm = { ...form, ownerId: cleanOwnerId }
    if (editingId) {
      updateStoreMutation.mutate({ id: editingId, payload: cleanForm }, { onSuccess: () => closeModal() })
    } else {
      createStoreMutation.mutate(cleanForm, { onSuccess: () => closeModal() })
    }
  }

  return (
    <div>
      <PageHeader
        title="Quản lý cửa hàng"
        description={`Tổng: ${pagination.total} cửa hàng`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer">
            <Plus size={18} /> Thêm cửa hàng
          </button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm cửa hàng..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput); setPage(1) }}
      />

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <StoreTable
          stores={stores}
          isLoading={isLoading}
          onDelete={setDeleteTargetId}
          isDeleting={deleteMutation.isPending}
        />
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <StoreFormModal
        showModal={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        isPending={createStoreMutation.isPending || updateStoreMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="cửa hàng"
        onConfirm={() => { if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) } }}
      />
    </div>
  )
}
