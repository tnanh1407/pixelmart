import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { useRegisterMutation, useGoogleLoginMutation } from '@/hooks/useAuthMutations'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Họ không được để trống'),
    lastName: z.string().min(1, 'Tên không được để trống'),
    email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    terms: z.boolean().refine((val) => val === true, 'Bạn phải đồng ý với Điều khoản'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface GoogleJwtPayload {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const registerMutation = useRegisterMutation()
  const googleLoginMutation = useGoogleLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Vui lòng đăng nhập để tiếp tục.',
            confirmButtonColor: '#049645',
          }).then(() => navigate('/login'))
        },
        onError: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại',
            text: err?.response?.data?.message || 'Đăng ký thất bại',
            confirmButtonColor: '#049645',
          })
        },
      }
    )
  }

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return

    const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential)

    googleLoginMutation.mutate(
      {
        googleId: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        avatar: decoded.picture,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Vui lòng đăng nhập để tiếp tục.',
            confirmButtonColor: '#049645',
          }).then(() => navigate('/login'))
        },
        onError: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký Google thất bại',
            text: err?.response?.data?.message || 'Đăng ký Google thất bại',
            confirmButtonColor: '#049645',
          })
        },
      }
    )
  }

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký Google thất bại',
      text: 'Đăng ký Google thất bại',
      confirmButtonColor: '#049645',
    })
  }

  const isPending = registerMutation.isPending || googleLoginMutation.isPending

  return (
    <div className="w-full max-w-md font-sans">
      <SpeedInsights />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-text-second mb-1 uppercase">Đăng ký</h2>
        <p className="text-text-second-light text-center text-sm mb-5 capitalize">Tham gia cộng đồng nông sản</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-second mb-1">Họ</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="Nguyễn"
                disabled={isPending}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.firstName ? 'border-red-error' : 'border-gray-200'}`}
              />
              {errors.firstName && <p className="text-red-error text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-second mb-1">Tên</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="Văn A"
                disabled={isPending}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.lastName ? 'border-red-error' : 'border-gray-200'}`}
              />
              {errors.lastName && <p className="text-red-error text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-second mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-second-light" />
              <input
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                disabled={isPending}
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
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Tạo mật khẩu"
                disabled={isPending}
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
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                disabled={isPending}
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

          <div className="flex items-start gap-1.5 text-xs text-text-second">
            <input
              type="checkbox"
              {...register('terms')}
              disabled={isPending}
              className={`mt-0.5 rounded cursor-pointer ${errors.terms ? 'border-red-error' : 'border-gray-300'}`}
            />
            <span className="text-sm">
              Tôi đồng ý với{' '}
              <a href="#" className="text-primary hover:text-primary-hover">Điều khoản</a>
              {' '}và{' '}
              <a href="#" className="text-primary hover:text-primary-hover">Bảo mật</a>
            </span>
          </div>
          {errors.terms && <p className="text-red-error text-xs mt-1">{errors.terms.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký tài khoản"
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
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          )}
        </div>

        <p className="text-center mt-4 text-xs text-text-second-light">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
