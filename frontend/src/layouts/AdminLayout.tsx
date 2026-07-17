import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { SiteHeader } from '@/components/admin/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import DefaultHelmet from '@/components/common/DefaultHelmet'

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
