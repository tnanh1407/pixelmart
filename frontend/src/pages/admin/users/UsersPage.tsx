import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Trash2, Lock, Unlock, Search, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

type UserRow = {
  _id: string; name: string; email: string; avatar?: string
  role: string; isActive: boolean; createdAt: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

export default function UsersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => adminService.getUsers({ page, limit: 20, search: search || undefined, role: roleFilter || undefined }),
    staleTime: 30 * 1000,
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Cập nhật thành công') },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteUser = async () => {
    if (!deleteTargetId) return
    setDeleting(true)
    try {
      await adminService.deleteUser(deleteTargetId)
      toast.success('Đã xóa người dùng')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    } catch {
      toast.error('Không thể xóa người dùng')
    } finally {
      setDeleting(false); setDeleteTargetId(null)
    }
  }

  const users: UserRow[] = data?.users || []
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-sm text-muted-foreground mt-1">Tổng: {pagination.total} người dùng</p>
        </div>
        <Button onClick={() => navigate('/admin/users/create')}>
          <Users size={18} /> Thêm người dùng
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (setSearch(searchInput), setPage(1))}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1) }}>
            <Search size={16} />
          </Button>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card h-fit"
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">Mã định danh</TableHead>
              <TableHead className="px-6">Người dùng</TableHead>
              <TableHead className="px-6">Email</TableHead>
              <TableHead className="px-6">Vai trò</TableHead>
              <TableHead className="px-6">Ngày tạo</TableHead>
              <TableHead className="px-6">Khóa</TableHead>
              <TableHead className="px-6 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-40" /></TableCell>
                  <TableCell className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-3.5 w-32" /></div></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-40" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-20" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="size-8 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4 text-right"><Skeleton className="size-8 rounded-lg ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center text-muted-foreground">
                  <Users size={36} className="opacity-30 mx-auto mb-2" />
                  <p className="text-sm">Không tìm thấy người dùng nào</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id} className="group">
                  <TableCell className="px-6 py-3 text-xs text-muted-foreground">
                    <span>{u._id}</span> <CopyButton text={u._id} />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} alt={u.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="px-6 py-3 capitalize">{u.role}</TableCell>
                  <TableCell className="px-6 py-3 text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Button variant="ghost" size="icon"
                      className={`size-8 cursor-pointer ${u.isActive ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'}`}
                      onClick={() => { setLocalActive((prev) => ({ ...prev, [u._id]: !u.isActive })); toggleActiveMutation.mutate(u._id) }}
                      disabled={toggleActiveMutation.isPending}
                      title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                    >
                      {u.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                    </Button>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleteTargetId(u._id)} disabled={deleting} title="Xóa">
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

      {/* Delete Dialog */}
      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa người dùng?</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={deleteUser} disabled={deleting}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
