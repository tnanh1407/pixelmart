import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Store } from 'lucide-react'
import { adminService, type StoreListResponse } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, DeleteDialog, StatusBadge } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { ShieldCheck } from 'lucide-react'

type StoreItem = StoreListResponse['stores'][number]

export default function StoreListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<StoreListResponse>({
    queryKey: ['admin-stores', page, search],
    queryFn: () => adminService.getStores({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.updateStore(id, { isActive: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleVerifiedMutation = useMutation({
    mutationFn: (id: string) => adminService.updateStore(id, { isVerified: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật xác minh thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Xóa cửa hàng thành công')
    },
    onError: () => toast.error('Không thể xóa cửa hàng'),
  })

  const stores = data?.stores || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const columns: Column<StoreItem>[] = [
    {
      header: 'Cửa hàng',
      cellClassName: 'py-3 px-4',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(`/admin/stores/${s._id}`)}
            className="size-10 rounded-lg overflow-hidden shrink-0 bg-muted border border-border cursor-pointer hover:opacity-85 transition-opacity"
          >
            {s.logo ? (
              <img src={s.logo} alt={s.name} className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center">
                <Store size={18} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p
              onClick={() => navigate(`/admin/stores/${s._id}`)}
              className="font-medium text-foreground text-sm cursor-pointer hover:text-primary transition-colors"
            >
              {s.name}
            </p>
            <p className="text-xs text-muted-foreground">{s.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      cellClassName: 'text-muted-foreground py-3 px-4 text-sm',
      render: (s) => s.email || 'N/A',
    },
    {
      header: 'Đánh giá',
      cellClassName: 'py-3 px-4 text-sm',
      render: (s) => (
        <span>
          <span className="font-semibold text-foreground">{s.ratingsAverage?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-muted-foreground ml-0.5">({s.ratingsQuantity || 0})</span>
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      cellClassName: 'py-3 px-4',
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
      headerClassName: 'text-right',
      cellClassName: 'text-right py-3 px-4',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => toggleVerifiedMutation.mutate(s._id)}
            disabled={toggleVerifiedMutation.isPending}
            className={`size-8 cursor-pointer transition-colors rounded-lg flex items-center justify-center ${s.isVerified ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' : 'text-muted-foreground hover:bg-muted'}`}
            title={s.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
          >
            <ShieldCheck size={16} />
          </button>
          <button
            onClick={() => toggleActiveMutation.mutate(s._id)}
            disabled={toggleActiveMutation.isPending}
            className={`size-8 cursor-pointer transition-colors rounded-lg flex items-center justify-center ${s.isActive ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : 'text-muted-foreground hover:bg-muted'}`}
            title={s.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {s.isActive ? <path d="M20 6 9 17l-5-5"/> : <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}
            </svg>
          </button>
          <button
            onClick={() => navigate(`/admin/stores/${s._id}/edit`)}
            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            onClick={() => setDeleteTargetId(s._id)}
            disabled={deleteMutation.isPending}
            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
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
        title="Quản lý cửa hàng"
        description={`Tổng: ${pagination.total} cửa hàng`}
        action={
          <button
            onClick={() => navigate('/admin/stores/new')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
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

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : stores.length === 0 ? (
          <EmptyState icon={Store} message="Không tìm thấy cửa hàng nào" />
        ) : (
          <DataTable columns={columns} data={stores} keyExtractor={(s) => s._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="cửa hàng"
        onConfirm={() => { if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) } }}
      />
    </div>
  )
}
