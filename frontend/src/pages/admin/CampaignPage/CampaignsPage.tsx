import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import { useNavigate } from 'react-router-dom'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import CampaignTable from './CampaignTable'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const {
    form, setForm, activeTab, setActiveTab,
    isUploading, resetForm, handleFileChange, buildPayload,
  } = useCampaignForm()

  const { createMutation, deleteMutation, toggleActiveMutation } = useAdminCampaignMutations()

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleViewDetail = (banner: any) => {
    navigate(`/admin/campaigns/${banner._id}`)
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-campaigns', page, search],
    queryFn: () => adminService.getCampaigns({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const openCreate = () => {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const payload = buildPayload()

    if (editingId) {
      Swal.fire({
        title: 'Xác nhận cập nhật?',
        text: 'Bạn có chắc chắn muốn lưu các thay đổi cho banner này?',
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
          // Handled by parent if needed
        }
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setShowModal(false),
      })
    }
  }

  const banners = data?.campaigns || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chiến dịch</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} chiến dịch</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Thêm chiến dịch
        </button>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="mb-6 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm chiến dịch..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`w-full pl-10 ${searchInput ? 'pr-10' : 'pr-4'} py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap flex items-center gap-1.5">
          <Search size={16} /> Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CampaignTable
          banners={banners}
          isLoading={isLoading}
          onDelete={(id) => deleteMutation.mutate(id)}
          onToggleActive={(id, isActive) => toggleActiveMutation.mutate({ id, isActive })}
          isDeleting={deleteMutation.isPending}
          onViewDetail={handleViewDetail}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Trang {pagination.page} / {pagination.totalPages}</p>
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
        )}
      </div>

      <CampaignFormModal
        showModal={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)}
        isPending={createMutation.isPending}
      />
    </div>
  )
}
