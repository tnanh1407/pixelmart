import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import FloatingActionButton from '@/components/common/FloatingActionButton'
import DefaultHelmet from '@/components/common/DefaultHelmet'

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <DefaultHelmet />
      <Header />
      <main className="flex-1 w-full">
        <div className='max-w-285 mx-auto'>
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  )
}
