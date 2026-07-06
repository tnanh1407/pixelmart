import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Forgot password:', data)
  }

  return <>
    <Helmet title='Quên Mật Khẩu | Nông phẩm An Việt'></Helmet>
    <div className="w-full max-w-md font-sans">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src="/core/logo_web.svg" alt="Nông sản Bưu điện" className="h-20 w-auto object-contain" />
          </Link>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-1">Quên mật khẩu?</h2>
        <p className="text-gray-500 text-center text-base mb-5">Nhập email để nhận link đặt lại mật khẩu</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009b4d] focus:border-transparent ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-lg text-base font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            Gửi link đặt lại mật khẩu
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5">
          <ArrowLeft size={16} className="text-gray-400" />
          <Link to="/login" className="text-sm text-primary hover:text-primary-hover font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  </>
}
