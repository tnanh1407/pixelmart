import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Store } from 'lucide-react'
import { adminService, type StoreListResponse } from '@/services/admin/admin.service'
import { useAdminStoreMutations } from '@/hooks/admin/stores'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, CopyButton, DeleteDialog, StatusBadge } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import StoreFormModal from './StoreFormModal'
import type { AdminStoreForm } from '@/hooks/admin/stores'
import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type StoreItem = StoreListResponse['stores'][number]

export default function StoresPage() {
  const navigate = useNavigate()
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
  const { toggleVerifiedMutation, toggleActiveMutation, createStoreMutation, updateStoreMutation, deleteMutation } = useAdminStoreMutations({ stores })

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

  const columns: Column<StoreItem>[] = [
    {
      header: 'Mã định danh',
      headerClassName: 'w-25 px-6',
      cellClassName: 'px-6 py-4 text-xs text-text-muted',
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <span>{s._id}</span>
          <CopyButton text={s._id} />
        </div>
      ),
    },
    {
      header: 'Cửa hàng',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div onClick={() => navigate(`/admin/stores/${s._id}`)} className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-85 transition-opacity border border-gray-100">
            {s.logo ? (
              <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Store size={18} className="text-text-muted" /></div>
            )}
          </div>
          <div>
            <p onClick={() => navigate(`/admin/stores/${s._id}`)} className="font-medium text-text text-sm cursor-pointer hover:text-primary transition-colors">{s.name}</p>
            <p className="text-xs text-text-muted">{s.email || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Liên hệ',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-text-muted',
      render: (s) => s.phone || 'N/A',
    },
    {
      header: 'Đánh giá',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-sm text-text',
      render: (s) => (
        <span>
          <span className="font-semibold">{s.ratingsAverage?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-text-muted ml-0.5"> ({s.ratingsQuantity || 0})</span>
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge active={s.isActive} />
          {s.isVerified && (
            <Badge variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 shadow-none border-none flex items-center gap-1">
              <ShieldCheck size={10} className="fill-blue-700 text-white" />
              Xác minh
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => toggleVerifiedMutation.mutate(s._id)} disabled={toggleVerifiedMutation.isPending}
            className={`h-8 w-8 cursor-pointer transition-colors rounded-lg flex items-center justify-center ${s.isVerified ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' : 'text-text-muted hover:bg-gray-100'}`}
            title={s.isVerified ? 'Bỏ xác minh' : 'Xác minh'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </button>
          <button onClick={() => toggleActiveMutation.mutate(s._id)} disabled={toggleActiveMutation.isPending}
            className={`h-8 w-8 cursor-pointer transition-colors rounded-lg flex items-center justify-center ${s.isActive ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : 'text-text-muted hover:bg-gray-100'}`}
            title={s.isActive ? 'Ẩn cửa hàng' : 'Hiện cửa hàng'}>
            {s.isActive ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            )}
          </button>
          <button onClick={() => setDeleteTargetId(s._id)} disabled={deleteMutation.isPending}
            className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            title="Xóa">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      ),
    },
  ]

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : stores.length === 0 ? (
          <EmptyState icon={Store} message="Không tìm thấy cửa hàng nào" />
        ) : (
          <DataTable columns={columns} data={stores} keyExtractor={(s) => s._id} />
        )}
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
