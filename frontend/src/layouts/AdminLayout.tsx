import { Outlet } from 'react-router-dom'
import DefaultHelmet from '@/components/common/DefaultHelmet'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/admin/Sidebar/SidebarHeaderMain'
import { AppSidebar } from '@/components/admin/Sidebar/Sidebar'

export default function AdminLayout() {
  return (
    <>
    <DefaultHelmet />
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <SiteHeader />

          <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider></>
  )
}
