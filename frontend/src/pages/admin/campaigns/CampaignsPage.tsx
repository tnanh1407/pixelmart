import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Image, Trash2, Search, Copy, Check } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'

type CampaignRow = { _id: string; title: string; image?: string; isActive: boolean; author?: string }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  const { form, setForm, activeTab, setActiveTab, isUploading, resetForm, handleFileChange, buildPayload } = useCampaignForm()
  const { createMutation, deleteMutation, toggleActiveMutation } = useAdminCampaignMutations()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-campaigns', page, search],
    queryFn: () => adminService.getCampaigns({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const openCreate = () => { setEditingId(null); resetForm(); setShowModal(true) }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editingId) { setShowConfirm(true) }
    else { createMutation.mutate(buildPayload(), { onSuccess: () => setShowModal(false) }) }
  }
  const handleConfirmUpdate = () => {
    createMutation.mutate(buildPayload(), { onSuccess: () => { setShowModal(false); setShowConfirm(false) } })
  }

  const campaigns: CampaignRow[] = data?.campaigns || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý chiến dịch</h1>
          <p className="text-sm text-muted-foreground mt-1">Tổng: {pagination.total} chiến dịch</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Thêm chiến dịch
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm chiến dịch..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (setSearch(searchInput), setPage(1))}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1) }}>
          <Search size={16} />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 w-25">Mã định danh</TableHead>
              <TableHead className="px-6 w-28">Hình ảnh</TableHead>
              <TableHead className="px-6">Tiêu đề</TableHead>
              <TableHead className="px-6 w-36">Tác giả</TableHead>
              <TableHead className="px-6 text-center w-28">Trạng thái</TableHead>
              <TableHead className="px-6 text-right w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-16" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-12 w-20 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3.5 w-40" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
                  <TableCell className="px-6 py-4 text-center"><Skeleton className="h-5 w-11 rounded-full mx-auto" /></TableCell>
                  <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-muted-foreground">
                  <Image size={36} className="opacity-30 mx-auto mb-2" />
                  <p className="text-sm">Chưa có chiến dịch nào</p>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c._id} className="group">
                  <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                    <span>{c._id}</span> <CopyButton text={c._id} />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <div onClick={() => setPreviewImage({ src: c.image || '', alt: c.title })} className="w-20 h-12 rounded-lg overflow-hidden border bg-muted flex items-center justify-center cursor-pointer hover:opacity-85">
                      {c.image ? <img src={c.image} alt={c.title} className="w-full h-full object-cover" /> : <Image size={16} className="text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <button onClick={() => navigate(`/admin/campaigns/${c._id}`)} className="text-sm font-medium hover:text-primary cursor-pointer line-clamp-1 max-w-64 text-left">
                      {c.title}
                    </button>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-xs text-muted-foreground">{c.author || '\u2014'}</TableCell>
                  <TableCell className="px-6 py-3 text-center">
                    <Switch checked={localActive[c._id] ?? c.isActive}
                      onCheckedChange={() => {
                        const next = !c.isActive
                        setLocalActive((prev) => ({ ...prev, [c._id]: next }))
                        toggleActiveMutation.mutate({ id: c._id, isActive: next })
                      }}
                      disabled={toggleActiveMutation.isPending} />
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleteTargetId(c._id)} disabled={deleteMutation.isPending} title="Xóa">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <span className="text-sm text-muted-foreground">Trang {pagination.page}/{pagination.totalPages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Trước</Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}>Sau</Button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <CampaignFormModal
        showModal={showModal} editingId={editingId} form={form} setForm={setForm}
        activeTab={activeTab} setActiveTab={setActiveTab} isUploading={isUploading}
        handleFileChange={handleFileChange} handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)} isPending={createMutation.isPending} />

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận cập nhật?</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn lưu các thay đổi cho chiến dịch này?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Hủy</Button>
            <Button onClick={handleConfirmUpdate}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa chiến dịch?</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa chiến dịch này?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={() => { if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) } }}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image preview */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          {previewImage && <img src={previewImage.src} alt={previewImage.alt} className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
