import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const actions = [
  { label: 'Tạo sản phẩm', path: '/admin/products' },
  { label: 'Tạo cửa hàng', path: '/admin/stores' },
  { label: 'Tạo chiến dịch', path: '/admin/campaigns' },
  { label: 'Thêm danh mục', path: '/admin/categories' },
  { label: 'Tạo người dùng', path: '/admin/users' },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Link key={action.label} to={action.path} className="block">
            <Button variant="outline" className="w-full justify-start h-9 text-sm font-normal">
              <Plus size={15} className="mr-2 text-muted-foreground" />
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
