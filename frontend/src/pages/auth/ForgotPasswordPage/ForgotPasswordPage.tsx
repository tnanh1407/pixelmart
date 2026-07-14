import { Link } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { useForgotPasswordMutation } from '@/hooks/auth'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Gửi email thành công',
          text: 'Vui lòng kiểm tra email để đặt lại mật khẩu.',
          confirmButtonColor: '#049645',
        })
      },
      onError: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Gửi email thất bại',
          text: err?.response?.data?.message || 'Gửi email thất bại',
          confirmButtonColor: '#049645',
        })
      },
    })
  }

  const isPending = forgotPasswordMutation.isPending

  return (
    <div className="w-full max-w-md font-sans">
      <SpeedInsights />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-text-second mb-1 uppercase">Quên mật khẩu?</h2>
        <p className="text-text-second-light text-center text-sm mb-5 capitalize">Nhập email để nhận link đặt lại mật khẩu</p>

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

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi link đặt lại mật khẩu"
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
