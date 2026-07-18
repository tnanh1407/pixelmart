import { Link } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { useForgotPasswordMutation } from '@/hooks/user/auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="w-full max-w-4xl font-sans">
      <SpeedInsights />
      <Card className="overflow-hidden p-0 border border-gray-100/50 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form */}
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 uppercase">Quên mật khẩu?</h1>
              <p className="text-sm text-gray-500">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>
            
            <div className="space-y-4">
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
                    className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-semibold transition-colors mt-2">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi link đặt lại mật khẩu"
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
              src="/auth/login_side.png"
              alt="PixelMart Forgot Password Cover"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.95]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl font-bold">PixelMart</h3>
              <p className="text-sm text-white/90 mt-1">Đồng hành cùng sự phát triển của sản phẩm OCOP nước nhà.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
