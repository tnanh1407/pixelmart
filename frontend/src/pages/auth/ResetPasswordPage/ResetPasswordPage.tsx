import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Eye, EyeOff, Lock, Loader2, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { authService } from '@/services/auth.service'

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

  if (!token) {
    return (
      <div className="w-full max-w-md font-sans">
        <SpeedInsights />
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-text-second mb-3 uppercase">Liên kết không hợp lệ</h2>
          <p className="text-text-second-light text-sm mb-5">Token đặt lại mật khẩu không tồn tại hoặc đã hết hạn.</p>
          <Link
            to="/forgot-password"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Gửi lại link
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await authService.resetPassword(token, data.password, data.confirmPassword)
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

  return (
    <div className="w-full max-w-md font-sans">
      <SpeedInsights />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-text-second mb-1 uppercase">Đặt lại mật khẩu</h2>
        <p className="text-text-second-light text-center text-sm mb-5 capitalize">Nhập mật khẩu mới của bạn</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-second mb-1">Mật khẩu mới</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-second-light" />
              <input
                disabled={isSubmitting}
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Tạo mật khẩu mới"
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

          <div>
            <label className="block text-xs font-medium text-text-second mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-second-light" />
              <input
                disabled={isSubmitting}
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.confirmPassword ? 'border-red-error' : 'border-gray-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-second-light hover:text-text-second"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-error text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5">
          <ArrowLeft size={16} className="text-text-second-light" />
          <Link to="/login" className="text-sm text-primary hover:text-primary-hover font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
