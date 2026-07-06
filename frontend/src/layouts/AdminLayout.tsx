import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
