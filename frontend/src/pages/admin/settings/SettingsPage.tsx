import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageContainer, PageHeader, SectionCard } from '@/components/admin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldContent } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Save, Lock } from 'lucide-react'

interface GeneralForm {
  siteName: string
  siteDescription: string
  logoUrl: string
}

interface ShippingForm {
  freeShippingThreshold: number
  tier1Name: string
  tier1Fee: number
  tier2Name: string
  tier2Fee: number
  tier3Name: string
  tier3Fee: number
}

interface NotificationForm {
  emailNotifications: boolean
  orderUpdates: boolean
  promotionUpdates: boolean
  systemUpdates: boolean
}

interface SecurityForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        checked ? 'bg-primary' : 'bg-input',
      )}
    >
      <span
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-card shadow-sm ring-0 transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)

  const generalForm = useForm<GeneralForm>({
    defaultValues: {
      siteName: 'PixelMart',
      siteDescription: 'Nền tảng thương mại điện tử nông sản OCOP',
      logoUrl: '/core/logo_web.svg',
    },
  })

  const shippingForm = useForm<ShippingForm>({
    defaultValues: {
      freeShippingThreshold: 500000,
      tier1Name: 'Nội thành',
      tier1Fee: 15000,
      tier2Name: 'Ngoại thành',
      tier2Fee: 30000,
      tier3Name: 'Tỉnh xa',
      tier3Fee: 50000,
    },
  })

  const notificationForm = useForm<NotificationForm>({
    defaultValues: {
      emailNotifications: true,
      orderUpdates: true,
      promotionUpdates: false,
      systemUpdates: true,
    },
  })

  const securityForm = useForm<SecurityForm>()

  const handleSave = (section: string) => {
    toast.success(`Đã lưu ${section}`)
  }

  const handleChangePassword = () => {
    const pwd = securityForm.watch('newPassword')
    const confirm = securityForm.watch('confirmPassword')
    if (pwd && pwd !== confirm) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }
    if (!securityForm.watch('currentPassword') || !pwd) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }
    handleSave('mật khẩu')
    securityForm.reset()
  }

  return (
    <PageContainer>
      <PageHeader title="Cài đặt" description="Quản lý cấu hình hệ thống" />

      <div className="space-y-6">
        <SectionCard
          title="Cài đặt chung"
          description="Thông tin cơ bản của hệ thống"
          action={
            <Button size="sm" onClick={() => handleSave('cài đặt chung')}>
              <Save size={14} className="mr-1" />
              Lưu
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Tên trang</FieldLabel>
              <FieldContent>
                <Input {...generalForm.register('siteName')} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Mô tả</FieldLabel>
              <FieldContent>
                <Input {...generalForm.register('siteDescription')} />
              </FieldContent>
            </Field>
            <Field className="md:col-span-2">
              <FieldLabel>Logo URL</FieldLabel>
              <FieldContent>
                <Input {...generalForm.register('logoUrl')} />
              </FieldContent>
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Cài đặt vận chuyển"
          description="Phí vận chuyển và ngưỡng miễn phí"
          action={
            <Button size="sm" onClick={() => handleSave('cài đặt vận chuyển')}>
              <Save size={14} className="mr-1" />
              Lưu
            </Button>
          }
        >
          <div className="space-y-4">
            <Field>
              <FieldLabel>Miễn phí vận chuyển cho đơn trên</FieldLabel>
              <FieldContent>
                <Input type="number" {...shippingForm.register('freeShippingThreshold', { valueAsNumber: true })} />
              </FieldContent>
            </Field>
            <Separator />
            <p className="text-sm font-medium text-foreground">Các mức phí vận chuyển</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                  <Field>
                    <FieldLabel>{`Tên mức ${i}`}</FieldLabel>
                    <FieldContent>
                      <Input {...shippingForm.register(`tier${i}Name` as `tier${typeof i}Name`)} />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>{`Phí mức ${i}`}</FieldLabel>
                    <FieldContent>
                      <Input type="number" {...shippingForm.register(`tier${i}Fee` as `tier${typeof i}Fee`, { valueAsNumber: true })} />
                    </FieldContent>
                  </Field>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Cài đặt thông báo"
          description="Cấu hình gửi thông báo qua email"
          action={
            <Button size="sm" onClick={() => handleSave('cài đặt thông báo')}>
              <Save size={14} className="mr-1" />
              Lưu
            </Button>
          }
        >
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <ToggleSwitch
                checked={notificationForm.watch('emailNotifications')}
                onChange={(v) => notificationForm.setValue('emailNotifications', v)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Thông báo email</p>
                <p className="text-xs text-muted-foreground">Bật/tắt gửi thông báo qua email</p>
              </div>
            </label>
            <Separator />
            <label className="flex items-center gap-3 cursor-pointer">
              <ToggleSwitch
                checked={notificationForm.watch('orderUpdates')}
                onChange={(v) => notificationForm.setValue('orderUpdates', v)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Cập nhật đơn hàng</p>
                <p className="text-xs text-muted-foreground">Thông báo khi có đơn hàng mới hoặc thay đổi trạng thái</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <ToggleSwitch
                checked={notificationForm.watch('promotionUpdates')}
                onChange={(v) => notificationForm.setValue('promotionUpdates', v)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Khuyến mãi</p>
                <p className="text-xs text-muted-foreground">Thông báo về các chương trình khuyến mãi</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <ToggleSwitch
                checked={notificationForm.watch('systemUpdates')}
                onChange={(v) => notificationForm.setValue('systemUpdates', v)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Hệ thống</p>
                <p className="text-xs text-muted-foreground">Thông báo cập nhật hệ thống</p>
              </div>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          title="Bảo mật"
          description="Đổi mật khẩu quản trị viên"
          action={
            <Button size="sm" onClick={handleChangePassword}>
              <Lock size={14} className="mr-1" />
              Đổi mật khẩu
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Mật khẩu hiện tại</FieldLabel>
              <FieldContent>
                <Input type={showPassword ? 'text' : 'password'} {...securityForm.register('currentPassword')} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Mật khẩu mới</FieldLabel>
              <FieldContent>
                <Input type={showPassword ? 'text' : 'password'} {...securityForm.register('newPassword')} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Xác nhận mật khẩu</FieldLabel>
              <FieldContent>
                <Input type={showPassword ? 'text' : 'password'} {...securityForm.register('confirmPassword')} />
              </FieldContent>
            </Field>
          </div>
          <div className="mt-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="size-3.5"
              />
              Hiện mật khẩu
            </label>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  )
}
