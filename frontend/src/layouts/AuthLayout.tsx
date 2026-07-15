import { Outlet } from 'react-router-dom'
import AuthHeader from '../components/AuthHeader'
import DefaultHelmet from '@/components/DefaultHelmet'

export default function AuthLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DefaultHelmet/>
      <AuthHeader />
      <main
        className="flex-1 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth/login-bg.jpg')" }}
      >
        <div className="w-full max-w-350 mx-auto px-6 flex justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
