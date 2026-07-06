import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingActionButton from '../components/FloatingActionButton'
import DefaultHelmet from '@/components/DefaultHelmet'

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <DefaultHelmet />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  )
}
