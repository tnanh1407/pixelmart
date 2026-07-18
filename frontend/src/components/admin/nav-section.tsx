import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { SidebarSection, SidebarItem } from '@/config/sidebar.config'

interface NavSectionProps {
  section: SidebarSection
  defaultOpen?: boolean
}

function NavItem({ item, isSub = false }: { item: SidebarItem; isSub?: boolean }) {
  const { isMobile } = useSidebar()

  const badge = item.badge ? (
    isSub ? (
      <Badge variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'} className="ml-auto text-[10px] px-1.5 h-4">
        {item.badge}
      </Badge>
    ) : (
      <SidebarMenuBadge className="ml-auto relative static translate-none w-auto h-auto flex items-center">
        <Badge variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 h-4 leading-none">
          {item.badge}
        </Badge>
      </SidebarMenuBadge>
    )
  ) : null

  if (item.children && item.children.length > 0) {
    return (
      <SidebarMenuItem>
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <item.icon />
              <span>{item.title}</span>
              <ChevronDown className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton asChild>
                    <NavLink
                      to={child.url}
                      end={child.end}
                      className={({ isActive }) =>
                        cn(
                          isActive && 'data-active:text-sidebar-accent-foreground data-active:bg-sidebar-accent',
                        )
                      }
                    >
                      <child.icon className="size-3.5" />
                      <span>{child.title}</span>
                      {badge}
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  const MenuComponent = isSub ? SidebarMenuSubButton : SidebarMenuButton

  return (
    <SidebarMenuItem>
      <MenuComponent asChild tooltip={item.title}>
        <NavLink
          to={item.url}
          end={item.end}
          className={({ isActive }) =>
            cn(
              isActive && [
                'data-active:text-sidebar-accent-foreground data-active:bg-sidebar-accent',
                'data-active:border-l-[2.5px] data-active:border-l-primary data-active:pl-[calc(0.5rem-2.5px)]',
              ],
            )
          }
        >
          <item.icon className={!isSub ? 'size-4' : 'size-3.5'} />
          <span>{item.title}</span>
          {badge}
        </NavLink>
      </MenuComponent>
    </SidebarMenuItem>
  )
}

export function NavSection({ section, defaultOpen = true }: NavSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const location = useLocation()
  const { state } = useSidebar()

  const hasActiveChild = section.items.some(
    (item) => location.pathname === item.url || location.pathname.startsWith(item.url + '/')
  )

  if (section.items.length === 0) return null

  return (
    <SidebarGroup>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-2 overflow-hidden rounded-md transition-all',
          state === 'collapsed' && 'justify-center py-1',
        )}
      >
        <SidebarGroupLabel
          asChild
          className={cn(
            'flex-1 cursor-pointer hover:text-sidebar-accent-foreground select-none',
            hasActiveChild && 'text-sidebar-accent-foreground',
          )}
        >
          <span className="flex items-center gap-2">
            {section.icon && <section.icon className="size-3.5" />}
            <span className="uppercase tracking-wider text-[11px] font-semibold">
              {section.title}
            </span>
          </span>
        </SidebarGroupLabel>
        {state !== 'collapsed' && (
          <ChevronDown
            className={cn(
              'size-3.5 text-sidebar-foreground/40 transition-transform duration-200 shrink-0',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      {open && (
        <SidebarMenu>
          {section.items.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </SidebarMenu>
      )}
    </SidebarGroup>
  )
}
