import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./SidebarFooter"
import { navGroups, type SidebarItem } from "./sidebar.config"

function NavItem({ item }: { item: SidebarItem }) {
  const { pathname } = useLocation()
  const isActive = item.end ? pathname === item.url : pathname.startsWith(item.url)

  return (
    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
      <NavLink to={item.url} end={item.end}>
        <item.icon />
        <span>{item.title}</span>
      </NavLink>
    </SidebarMenuButton>
  )
}

function SidebarGroupSection({ group }: { group: typeof navGroups[number] }) {
  const [open, setOpen] = useState(group.defaultOpen ?? true)
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-0.5 hover:text-sidebar-accent-foreground cursor-pointer select-none",
          collapsed && "justify-center"
        )}
      >
        {!collapsed && (
          <>
            <SidebarGroupLabel className="flex-1">{group.label}</SidebarGroupLabel>
            <ChevronDown
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {open && (
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <NavItem item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <img src="/core/logo_web.svg" alt="PixelMart" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {navGroups.map((group) => (
          <SidebarGroupSection key={group.label} group={group} />
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
