import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { adminService } from '@/services/admin/admin.service'
import { PageHeader, SearchToolbar, Pagination, LoadingState, EmptyState, DeleteDialog } from '@/components/admin/shared'
import UserTable, { type UserRow } from './UserTable'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => adminService.getUsers({ page, limit: 10, search: search || undefined, role: roleFilter || undefined }),
    staleTime: 30 * 1000,
  })

  const users: UserRow[] = data?.users || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <PageHeader
        title="Quản lý người dùng"
        description={`${pagination.total} người dùng`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchToolbar
            placeholder="Tìm kiếm người dùng..."
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => { setSearch(searchInput); setPage(1) }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground h-fit self-start"
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <UserTable
          users={users}
          isLoading={isLoading}
          onDelete={setDeleteTargetId}
        />
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="người dùng"
        onConfirm={() => { if (deleteTargetId) { setDeleteTargetId(null) } }}
      />
    </div>
  )
}
