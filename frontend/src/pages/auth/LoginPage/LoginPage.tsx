import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleLogin } from '@react-oauth/google'
import Swal from 'sweetalert2'
import { useLoginMutation } from '@/hooks/auth'
import { useGoogleAuth } from '@/hooks/auth'

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()

  const loginMutation = useLoginMutation()
  const { handleGoogleSuccess, handleGoogleError, isPending: isGooglePending } = useGoogleAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/'),
      onError: (err: any) => {
        const message = err?.response?.data?.message || 'Đăng nhập thất bại'
        const isUnverified = message.toLowerCase().includes('email not verified')

        if (isUnverified) {
          Swal.fire({
            icon: 'warning',
            title: 'Email chưa được xác thực',
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Xác thực ngay',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#049645',
            cancelButtonColor: '#6b7280',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/verify-email')
            }
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại',
            text: message,
            confirmButtonColor: '#049645',
          })
        }
      },
    })
  }

  const isPending = loginMutation.isPending || isGooglePending

  return (
    <div className="w-full max-w-md font-sans">
      <SpeedInsights />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-text-second mb-1 uppercase">Đăng nhập</h2>
        <p className="text-text-second-light text-center text-sm mb-5 capitalize">Chào mừng bạn quay trở lại!</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-second mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-second-light" />
              <input
                disabled={isPending}
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-error' : 'border-gray-200'}`}
              />
            </div>
            {errors.email && <p className="text-red-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-second mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-second-light" />
              <input
                disabled={isPending}
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Nhập mật khẩu"
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.password ? 'border-red-error' : 'border-gray-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-second-light hover:text-text-second"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-text-second">
              <input
                disabled={isPending}
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-hover">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
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
          <span className="text-xs text-text-second-light">hoặc</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          {isPending ? (
            <div className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-text-second">Đang xử lý...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          )}
        </div>

        <p className="text-center mt-4 text-xs text-text-second-light">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
