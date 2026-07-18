import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Users, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { adminService, type UserListResponse } from '@/services/admin/admin.service'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  PageHeader,
  SearchToolbar,
  DataTable,
  Pagination,
  LoadingState,
  EmptyState,
} from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

type UserItem = UserListResponse['users'][number]

const roleFilters: { label: string; value: string }[] = [
  { label: 'Tất cả', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Admin', value: 'admin' },
]

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive' as const
    case 'vendor': return 'default' as const
    default: return 'secondary' as const
  }
}

export default function UserListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const { data, isLoading, isError, refetch } = useQuery<UserListResponse>({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => adminService.getUsers({
      page,
      limit: 10,
      search: search || undefined,
      role: roleFilter || undefined,
    }),
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => { invalidate(); toast.success('Cập nhật trạng thái thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const users: UserItem[] = data?.users || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  const columns: Column<UserItem>[] = [
    {
      header: 'Người dùng',
      cellClassName: 'py-3 px-4',
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={u.avatar} alt={u.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {u.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground text-sm">{u.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: (u) => u.email,
    },
    {
      header: 'Số điện thoại',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: (u) => u.phone || 'N/A',
    },
    {
      header: 'Vai trò',
      cellClassName: 'py-3 px-4',
      render: (u) => (
        <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
          {u.role === 'admin' ? 'Admin' : u.role === 'vendor' ? 'Vendor' : 'User'}
        </Badge>
      ),
    },
    {
      header: 'Trạng thái',
      cellClassName: 'py-3 px-4',
      render: (u) => (
        <Badge
          variant={u.isActive ? 'default' : 'destructive'}
          className={u.isActive ? 'bg-success-light text-success border-none' : ''}
        >
          {u.isActive ? 'Hoạt động' : 'Khóa'}
        </Badge>
      ),
    },
    {
      header: 'Ngày tạo',
      cellClassName: 'py-3 px-4 text-sm text-muted-foreground',
      render: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'py-3 px-4 text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={toggleActiveMutation.isPending}
            onClick={() => toggleActiveMutation.mutate(u._id)}
            title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
            className={u.isActive ? 'text-success hover:text-success hover:bg-success-light' : 'text-muted-foreground hover:text-foreground'}
          >
            {u.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Quản lý người dùng"
        description={`Tổng: ${pagination.total} người dùng`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchToolbar
            placeholder="Tìm kiếm người dùng..."
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => { setSearch(searchInput.trim()); setPage(1) }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {roleFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => { setRoleFilter(value); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                roleFilter === value
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive-light">
              <Users className="size-7 text-destructive" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">Có lỗi xảy ra</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Không thể tải danh sách người dùng. Vui lòng thử lại sau.
            </p>
            <Button variant="outline" onClick={() => refetch()}>Thử lại</Button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            message="Không tìm thấy người dùng nào"
            description={search || roleFilter ? 'Thử thay đổi bộ lọc tìm kiếm' : 'Chưa có người dùng nào trong hệ thống'}
          />
        ) : (
          <DataTable columns={columns} data={users} keyExtractor={(u) => u._id} />
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} total={pagination.total} />
      </div>
    </div>
  )
}
