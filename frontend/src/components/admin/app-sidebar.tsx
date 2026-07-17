import * as React from "react"
import { Link } from "react-router-dom"
import {
  ImageIcon,
  LayoutDashboardIcon,
  PackageIcon,
  StoreIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/auth"

const navMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
    end: true,
  },
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: UsersIcon,
  },
  {
    title: "Sản phẩm",
    url: "/admin/products",
    icon: PackageIcon,
  },
  {
    title: "Cửa hàng",
    url: "/admin/stores",
    icon: StoreIcon,
  },
  {
    title: "Danh mục",
    url: "/admin/categories",
    icon: TagsIcon,
  },
  {
    title: "Chiến dịch",
    url: "/admin/campaigns",
    icon: ImageIcon,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/admin">
                <img src="/core/logo_web.svg" alt="PixelMart" className="size-6" />
                <span className="text-xl font-semibold capitalize">Trang quản lý</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Admin",
            email: user?.email || "admin@pixelmart.vn",
            avatar: user?.avatar || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
