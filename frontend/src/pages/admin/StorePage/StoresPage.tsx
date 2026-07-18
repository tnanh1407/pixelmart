import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { adminService, type StoreListResponse } from '@/services/admin/admin.service'
import { useAdminStoreMutations } from '@/hooks/admin/stores'
import { useNavigate } from 'react-router-dom'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import StoresTable from './StoresTable'
import StoreFormModal from './StoreFormModal'
import type { AdminStoreForm } from '@/hooks/admin/stores'

export default function StoresPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  // Modal States
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminStoreForm>({
    name: '',
    logo: '',
    description: '',
    phone: '',
    email: '',
    address: { street: '', ward: '', district: '', city: '' },
    isVerified: false,
    isActive: true,
    ownerId: '',
  })

  const { data, isLoading } = useQuery<StoreListResponse>({
    queryKey: ['admin-stores', page, search],
    queryFn: () => adminService.getStores({ page, limit: 10, search: search || undefined, all: true } as any),
    staleTime: 30 * 1000,
  })

  const stores = data?.stores || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const { toggleVerifiedMutation, toggleActiveMutation, createStoreMutation, updateStoreMutation, deleteMutation } =
    useAdminStoreMutations({ stores })

  const handleViewDetail = (store: any) => {
    navigate(`/admin/stores/${store._id}`)
  }

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      name: '', logo: '', description: '', phone: '', email: '',
      address: { street: '', ward: '', district: '', city: '' },
      isVerified: false, isActive: true, ownerId: '',
    })
    setShowModal(true)
  }

  const openEdit = (store: any) => {
    setEditingId(store._id)
    setForm({
      name: store.name || '',
      logo: store.logo || '',
      description: store.description || '',
      phone: store.phone || '',
      email: store.email || '',
      address: {
        street: store.address?.street || '',
        ward: store.address?.ward || '',
        district: store.address?.district || '',
        city: store.address?.city || '',
      },
      isVerified: store.isVerified || false,
      isActive: store.isActive !== undefined ? store.isActive : true,
      ownerId: typeof store.ownerId === 'object' && store.ownerId !== null ? (store.ownerId as any)._id : (store.ownerId || ''),
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.ownerId) return

    const cleanOwnerId =
      typeof form.ownerId === 'object' && form.ownerId !== null
        ? (form.ownerId as any)._id
        : form.ownerId

    const cleanForm = { ...form, ownerId: cleanOwnerId }

    if (editingId) {
      updateStoreMutation.mutate({ id: editingId, payload: cleanForm }, {
        onSuccess: () => closeModal(),
      })
    } else {
      createStoreMutation.mutate(cleanForm, {
        onSuccess: () => closeModal(),
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text capitalize">Quản lý cửa hàng</h1>
          <p className="text-sm text-text-muted mt-1"><span className='font-bold capitalize text-base'>Tổng: </span>{pagination.total} cửa hàng</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors capitalize cursor-pointer">
          <Plus size={18} /> Thêm cửa hàng
        </button>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="mb-6 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Tìm kiếm cửa hàng..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`w-full pl-10 ${searchInput ? 'pr-10' : 'pr-4'} py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer capitalize">
          <Search size={16} /> Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <StoresTable
          stores={stores}
          isLoading={isLoading}
          onToggleVerified={toggleVerifiedMutation.mutate}
          isToggleVerifiedPending={toggleVerifiedMutation.isPending}
          onToggleActive={toggleActiveMutation.mutate}
          isToggleActivePending={toggleActiveMutation.isPending}
          onDelete={deleteMutation.mutate}
          isDeletePending={deleteMutation.isPending}
          onViewDetail={handleViewDetail}
        />

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-text-muted whitespace-nowrap shrink-0">Trang {pagination.page} / {pagination.totalPages}</p>
            <div className="shrink-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className={page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
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
    </div>
  )
}
