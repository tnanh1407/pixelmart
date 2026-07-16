import { Outlet } from 'react-router-dom'
import UserSidebar from '@/components/layout/UserSidebar'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
          <UserSidebar />
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
