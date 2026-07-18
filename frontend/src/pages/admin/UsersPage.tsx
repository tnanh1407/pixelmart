import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Users } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageHeader, SearchToolbar, DataTable, Pagination, LoadingState, EmptyState, DeleteDialog } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const queryClient = useQueryClient()
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

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Xóa người dùng thành công')
    },
    onError: () => toast.error('Không thể xóa người dùng'),
  })

  const users: User[] = data?.users || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) { case 'admin': return 'destructive' as const; case 'vendor': return 'default' as const; default: return 'secondary' as const }
  }

  const columns: Column<User>[] = [
    {
      header: 'Người dùng',
      cellClassName: 'py-3 px-4',
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={u.avatar} alt={u.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{u.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{u.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      cellClassName: 'text-muted-foreground py-3 px-4',
      render: (u) => u.email,
    },
    {
      header: 'Vai trò',
      cellClassName: 'py-3 px-4',
      render: (u) => <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">{u.role}</Badge>,
    },
    {
      header: 'Trạng thái',
      cellClassName: 'py-3 px-4',
      render: (u) => <Badge variant={u.isActive ? 'default' : 'destructive'}>{u.isActive ? 'Hoạt động' : 'Khóa'}</Badge>,
    },
    {
      header: 'Ngày tạo',
      cellClassName: 'text-muted-foreground text-sm py-3 px-4',
      render: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'text-right py-3 px-4',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => toggleActiveMutation.mutate(u._id)} disabled={toggleActiveMutation.isPending}
            className={`h-8 w-8 cursor-pointer rounded-lg flex items-center justify-center transition-colors ${u.isActive ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'}`}
            title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}>
            {u.isActive ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M17 12h.01"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M11 12h2"/></svg>
            )}
          </button>
          <button onClick={() => setDeleteTargetId(u._id)} disabled={deleteMutation.isPending}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
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
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white text-text h-fit self-start"
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} message="Không tìm thấy người dùng nào" />
        ) : (
          <DataTable columns={columns} data={users} keyExtractor={(u) => u._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>

      <DeleteDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        entityLabel="người dùng"
        onConfirm={() => { if (deleteTargetId) { deleteMutation.mutate(deleteTargetId); setDeleteTargetId(null) } }}
      />
    </div>
  )
}
