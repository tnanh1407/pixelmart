import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Zap } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import type { FlashSaleListResponse } from '@/services/admin/flash-sales.service'
import { toast } from 'sonner'
import {
  PageHeader,
  SearchToolbar,
  Pagination,
  LoadingState,
  EmptyState,
  ErrorState,
  DeleteDialog,
} from '@/components/admin/shared'
import FlashSaleTable, { type FlashSaleRow } from './FlashSaleTable'
import { Button } from '@/components/ui/button'

interface FlashSaleRow {
  _id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
}

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

const formatDate = (date?: string) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function FlashSaleListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery<FlashSaleListResponse>({
    queryKey: ['admin-flash-sales', page, search],
    queryFn: () => adminService.getFlashSales({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteFlashSale(id),
    onSuccess: () => { invalidate(); toast.success('Xóa flash sale thành công') },
    onError: () => toast.error('Không thể xóa flash sale'),
  })

  const flashSales: FlashSaleRow[] = (data?.flashSales || []) as FlashSaleRow[]
  const pagination = data?.pagination || emptyPagination

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý Flash Sale" />
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Flash Sale"
        description={`Tổng: ${pagination.total} chương trình`}
        action={
          <Button onClick={() => navigate('/admin/flash-sales/create')}>
            <Plus size={18} />
            Thêm Flash Sale
          </Button>
        }
      />

      <SearchToolbar
        placeholder="Tìm kiếm flash sale..."
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : flashSales.length === 0 ? (
          <EmptyState
            icon={Zap}
            message="Không tìm thấy flash sale nào"
            description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có chương trình flash sale nào'}
            action={
              <Button onClick={() => navigate('/admin/flash-sales/create')}>
                <Plus size={16} />
                Thêm flash sale đầu tiên
              </Button>
            }
          />
        ) : (
          <FlashSaleTable flashSales={flashSales} onDelete={setDeleteTargetId} isDeleting={deleteMutation.isPending} />
        )}
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          total={pagination.total}
        />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="flash sale"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
      />
    </div>
  )
}
