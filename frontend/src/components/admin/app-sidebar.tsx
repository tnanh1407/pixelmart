import * as React from "react"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"

import { NavSection } from "@/components/admin/nav-section"
import { NavSearch } from "@/components/admin/nav-search"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/user/auth"
import {
  sidebarConfig,
  workspaceConfig,
  filterSidebarConfig,
  type SidebarSection,
} from "@/config/sidebar.config"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const [filteredSections, setFilteredSections] = useState<SidebarSection[]>(sidebarConfig)

  const sections = useMemo(() => {
    if (!user) return sidebarConfig
    return filterSidebarConfig(sidebarConfig, '', user.role)
  }, [user])

  const handleSearchFilter = (filtered: SidebarSection[]) => {
    setFilteredSections(filtered)
  }

  const displayedSections = filteredSections.length !== sidebarConfig.length
    ? filteredSections
    : sections

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/admin" className="flex items-center gap-2.5">
                <img
                  src={workspaceConfig.logo}
                  alt={workspaceConfig.name}
                  className="size-6"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-semibold">{workspaceConfig.name}</span>
                  {workspaceConfig.subtitle && (
                    <span className="text-[10px] text-muted-foreground">
                      {workspaceConfig.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <NavSearch sections={sections} onFilter={handleSearchFilter} />

      <SidebarContent className="px-1">
        {displayedSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            defaultOpen={section.defaultOpen}
          />
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Admin",
            email: user?.email || "admin@pixelmart.vn",
            avatar: user?.avatar || "",
            role: user?.role || "Admin",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
