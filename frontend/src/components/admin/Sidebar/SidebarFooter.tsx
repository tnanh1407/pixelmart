import { Link } from "react-router-dom"
import { UserRound, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth, useLogoutMutation } from "@/hooks/user/auth"

export function NavUser() {
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  const initials = user?.name
    ?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "AD"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "Admin"} />
                <AvatarFallback className="rounded-lg text-xs bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name || "Admin"}</span>
                <span className="truncate text-[11px] text-muted-foreground">{user?.role || "Admin"}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" sideOffset={4} className="min-w-40 rounded-lg">
            <DropdownMenuItem asChild>
              <Link to="/user/profile"><UserRound /> Hồ sơ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logoutMutation.mutate(undefined)} className="text-red-500">
              <LogOut /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
