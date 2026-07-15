import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Eye, EyeOff, Lock, Loader2, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { authService } from '@/services/auth.service'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await authService.resetPassword(token!, data.password, data.confirmPassword)
      Swal.fire({
        icon: 'success',
        title: 'Đặt lại mật khẩu thành công!',
        text: 'Vui lòng đăng nhập với mật khẩu mới.',
        confirmButtonColor: '#049645',
      }).then(() => navigate('/login'))
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Đặt lại mật khẩu thất bại',
        text: err?.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn',
        confirmButtonColor: '#049645',
      })
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-4xl font-sans">
        <SpeedInsights />
        <Card className="overflow-hidden p-0 border border-gray-100/50 shadow-2xl">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8 flex flex-col justify-center text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 uppercase">Liên kết không hợp lệ</h2>
              <p className="text-gray-500 text-sm mb-6">Token đặt lại mật khẩu không tồn tại hoặc đã hết hạn.</p>
              <Link
                to="/forgot-password"
                className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Gửi lại link
              </Link>
            </div>
            
            <div className="relative hidden bg-slate-50 md:block">
              <img
                src="/auth/login_side.png"
                alt="PixelMart Cover"
                className="absolute inset-0 h-full w-full object-cover brightness-[0.95]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl font-sans">
      <SpeedInsights />
      <Card className="overflow-hidden p-0 border border-gray-100/50 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form */}
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 uppercase">Đặt lại mật khẩu</h1>
              <p className="text-sm text-gray-500">
                Nhập mật khẩu mới của bạn bên dưới.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    disabled={isSubmitting}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Tạo mật khẩu mới"
                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    disabled={isSubmitting}
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Nhập lại mật khẩu"
                    className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-semibold transition-colors mt-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-6">
                <ArrowLeft size={16} className="text-gray-400" />
                <Link to="/login" className="text-sm text-primary hover:underline font-semibold">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </form>
          
          {/* Side Image */}
          <div className="relative hidden bg-slate-50 md:block">
            <img
              src="/auth/login-bg.jpg"
              alt="PixelMart Reset Password Cover"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.95]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
