import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Image } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import { useNavigate } from 'react-router-dom'
import { PageHeader, SearchToolbar, Pagination, LoadingState, EmptyState, DeleteDialog, ConfirmDialog, ImagePreview } from '@/components/admin/shared'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import CampaignTable, { type CampaignRow } from './CampaignTable'

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<CampaignRow | null>(null)

  const { form, setForm, activeTab, setActiveTab, isUploading, resetForm, handleFileChange, buildPayload } = useCampaignForm()
  const { createMutation, deleteMutation } = useAdminCampaignMutations()

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

  const campaigns: CampaignRow[] = data?.campaigns || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

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

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <CampaignTable
          campaigns={campaigns}
          isLoading={isLoading}
          onDelete={setDeleteTargetId}
          onPreviewImage={setPreviewCampaign}
          isDeleting={deleteMutation.isPending}
        />
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
