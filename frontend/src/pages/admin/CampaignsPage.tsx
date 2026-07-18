import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Image } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, CopyButton, DeleteDialog, ConfirmDialog, ImagePreview } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'

interface Campaign {
  _id: string
  title: string
  image?: string
  isActive: boolean
  author?: string
}

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null)

  const { form, setForm, activeTab, setActiveTab, isUploading, resetForm, handleFileChange, buildPayload } = useCampaignForm()
  const { createMutation, deleteMutation, toggleActiveMutation } = useAdminCampaignMutations()

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
    if (editingId) {
      setShowConfirmDialog(true)
    } else {
      const payload = buildPayload()
      createMutation.mutate(payload, { onSuccess: () => setShowModal(false) })
    }
  }

  const handleConfirmUpdate = () => {
    const payload = buildPayload()
    createMutation.mutate(payload, {
      onSuccess: () => { setShowModal(false); setShowConfirmDialog(false) },
    })
  }

  const campaigns: Campaign[] = data?.campaigns || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const columns: Column<Campaign>[] = [
    {
      header: 'Mã định danh',
      headerClassName: 'w-25 px-6',
      cellClassName: 'px-6 py-4 text-xs text-text-muted',
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <span>{c._id}</span>
          <CopyButton text={c._id} />
        </div>
      ),
    },
    {
      header: 'Hình ảnh',
      headerClassName: 'w-25 px-6',
      cellClassName: 'px-6 py-4',
      render: (c) => (
        <div onClick={() => setPreviewCampaign(c)}
          className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-85 transition-opacity">
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={16} className="text-text-muted" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Tiêu đề',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4',
      render: (c) => (
        <p onClick={() => navigate(`/admin/campaigns/${c._id}`)}
          className="font-medium text-text text-sm truncate cursor-pointer hover:text-primary transition-colors max-w-75">
          {c.title}
        </p>
      ),
    },
    {
      header: 'Tác giả',
      headerClassName: 'px-6',
      cellClassName: 'px-6 py-4 text-xs text-text-muted',
      render: (c) => c.author || '\u2014',
    },
    {
      header: 'Trạng thái',
      headerClassName: 'px-6 text-center',
      cellClassName: 'px-6 py-4 text-center',
      render: (c) => (
        <button
          type="button"
          onClick={() => toggleActiveMutation.mutate({ id: c._id, isActive: c.isActive })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${c.isActive ? 'bg-primary' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${c.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right px-6',
      cellClassName: 'px-6 py-4 text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setDeleteTargetId(c._id)}
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
        title="Quản lý chiến dịch"
        description={`Tổng: ${pagination.total} chiến dịch`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer">
            <Plus size={18} />
            Thêm chiến dịch
          </button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm chiến dịch..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput); setPage(1) }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : campaigns.length === 0 ? (
          <EmptyState icon={Image} message="Chưa có chiến dịch nào" />
        ) : (
          <DataTable columns={columns} data={campaigns} keyExtractor={(c) => c._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
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

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Xác nhận cập nhật?"
        description="Bạn có chắc chắn muốn lưu các thay đổi cho chiến dịch này?"
        onConfirm={handleConfirmUpdate}
      />

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="chiến dịch"
        onConfirm={() => {
          if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) }
        }}
      />

      <ImagePreview
        open={!!previewCampaign}
        onOpenChange={(open) => !open && setPreviewCampaign(null)}
        src={previewCampaign?.image}
        alt={previewCampaign?.title}
      />
    </div>
  )
}
