import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleLogin } from '@react-oauth/google'
import Swal from 'sweetalert2'
import { useLoginMutation } from '@/hooks/user/auth'
import { useGoogleAuth } from '@/hooks/user/auth'
import { getAuthenticatedRedirectPath } from '@/utils/authRedirect'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      onSuccess: (user) => navigate(getAuthenticatedRedirectPath(user), { replace: true }),
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
    <div className="w-full max-w-4xl font-sans">
      <SpeedInsights />
      <Card className="overflow-hidden p-0 border border-gray-100/50 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form */}
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 uppercase">Đăng nhập</h1>
              <p className="text-sm text-gray-500">
                Chào mừng bạn quay trở lại!
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    disabled={isPending}
                    type="email"
                    {...register('email')}
                    placeholder="email@example.com"
                    className={`pl-9 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline hover:text-primary-hover"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    disabled={isPending}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Nhập mật khẩu"
                    className={`pl-9 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  disabled={isPending}
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <Label htmlFor="remember" className="text-xs text-gray-600 font-normal cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              {/* Submit button */}
              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              {/* Separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative px-3 bg-white text-xs text-gray-400 uppercase">Hoặc đăng nhập với</span>
              </div>

              {/* Google Login */}
              <div className="flex justify-center w-full">
                {isPending ? (
                  <div className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm text-gray-500 bg-gray-50">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center GoogleLoginWrapper">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="signin_with"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
                )}
              </div>

              {/* Sign up Link */}
              <p className="text-center mt-6 text-xs text-gray-500">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary hover:underline hover:text-primary-hover font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
          
          {/* Side Image */}
          <div className="relative hidden bg-slate-50 md:block">
            <img
              src="/auth/login_side.png"
              alt="PixelMart Login Cover"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.95]"
            />
            {/* Logo/Branding on Cover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl font-bold">PixelMart</h3>
              <p className="text-sm text-white/90 mt-1">Hệ thống phân phối nông sản, đặc sản OCOP chất lượng cao.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
