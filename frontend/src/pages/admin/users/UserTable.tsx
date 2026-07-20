import { useState } from 'react'
import { Users, Trash2, Lock, Unlock } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export type UserRow = {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  isActive: boolean
  createdAt: string
}

interface UserTableProps {
  users: UserRow[]
  isLoading?: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'admin': return 'destructive' as const
    case 'vendor': return 'default' as const
    default: return 'secondary' as const
  }
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-40" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell className="px-6 py-4"><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Users size={36} className="opacity-30" />
          <p className="text-sm">Không tìm thấy người dùng nào</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function UserTable({
  users,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: UserTableProps) {
  const queryClient = useQueryClient()
  const [localActive, setLocalActive] = useState<Record<string, boolean>>({})

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 text-left">Người dùng</TableHead>
          <TableHead className="px-6 text-left">Email</TableHead>
          <TableHead className="px-6 text-left w-24">Vai trò</TableHead>
          <TableHead className="px-6 text-left w-28">Trạng thái</TableHead>
          <TableHead className="px-6 text-left w-28">Ngày tạo</TableHead>
          <TableHead className="px-6 text-right w-24">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows />
        ) : users.length === 0 ? (
          <EmptyRow />
        ) : (
          users.map((u) => (
            <TableRow key={u._id} className="group">
              <TableCell className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatar} alt={u.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{u.name}</span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-3 text-sm text-muted-foreground">
                {u.email}
              </TableCell>

              <TableCell className="px-6 py-3">
                <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
                  {u.role}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-3">
                <Badge variant={u.isActive ? 'default' : 'destructive'} className="text-xs">
                  {u.isActive ? 'Hoạt động' : 'Khóa'}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-3 text-sm text-muted-foreground">
                {new Date(u.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>

              <TableCell className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`size-8 cursor-pointer ${u.isActive ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => {
                      const next = !u.isActive
                      setLocalActive((prev) => ({ ...prev, [u._id]: next }))
                      toggleActiveMutation.mutate(u._id)
                    }}
                    disabled={toggleActiveMutation.isPending}
                    title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                  >
                    {u.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(u._id)}
                    disabled={isDeleting}
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
