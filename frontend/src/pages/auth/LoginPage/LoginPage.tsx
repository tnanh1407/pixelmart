import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from "lucide-react";


const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormData) => {
    console.log('Login:', data)
  }

  return (
    <div className="w-full max-w-md font-sans">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src="/core/logo_web_bg.svg" alt="Nông sản An Việt" className="h-20 w-auto object-contain" />
          </Link>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-1">Đăng nhập</h2>
        <p className="text-gray-500 text-center text-sm mb-5">Chào mừng bạn quay trở lại!</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                disabled={isSubmitting}
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009b4d] focus:border-transparent ${errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                disabled={isSubmitting}
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Nhập mật khẩu"
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009b4d] focus:border-transparent ${errors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              <input
                disabled={isSubmitting}
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="text-xs text-[#009b4d] hover:text-primary-hover">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#009b4d] text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors" disabled={isSubmitting}>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700">Đăng nhập với Google</span>
        </button>

        <p className="text-center mt-4 text-xs text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#009b4d] hover:text-primary-hover font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
