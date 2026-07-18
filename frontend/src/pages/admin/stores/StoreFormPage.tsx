import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Upload, Store, Search, Check, X } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { storeService } from '@/services/user/store.service'
import api from '@/services/client'
import { toast } from 'sonner'
import { PageContainer, PageHeader, LoadingState, SectionCard } from '@/components/admin/shared'

const storeSchema = z.object({
  name: z.string().min(1, 'Tên cửa hàng không được để trống'),
  slug: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  street: z.string().optional(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
})

type StoreFormData = z.infer<typeof storeSchema>

export default function StoreFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [logo, setLogo] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [searchedUsers, setSearchedUsers] = useState<any[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<{ _id: string; name: string; email: string } | null>(null)

  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('')

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ['admin-store-detail', id],
    queryFn: () => storeService.getStoreById(id || ''),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '', slug: '', description: '', email: '', phone: '',
      city: '', district: '', ward: '', street: '',
      isVerified: false, isActive: true,
    },
  })

  const watchCity = watch('city')
  const watchDistrict = watch('district')

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        const provRes = await api.get('/addresses/provinces')
        const provList = provRes.data.data || []
        setProvinces(provList)
      } catch { /* ignore */ }
    }
    loadAddressData()
  }, [])

  useEffect(() => {
    if (!selectedProvinceCode) return
    const loadDistricts = async () => {
      try {
        const res = await api.get(`/addresses/districts?provinceCode=${selectedProvinceCode}`)
        setDistricts(res.data.data || [])
        setWards([])
      } catch { /* ignore */ }
    }
    loadDistricts()
  }, [selectedProvinceCode])

  useEffect(() => {
    if (!selectedDistrictCode) return
    const loadWards = async () => {
      try {
        const res = await api.get(`/addresses/wards?districtCode=${selectedDistrictCode}`)
        setWards(res.data.data || [])
      } catch { /* ignore */ }
    }
    loadWards()
  }, [selectedDistrictCode])

  useEffect(() => {
    if (isEdit && store) {
      reset({
        name: store.name || '',
        slug: store.slug || '',
        description: store.description || '',
        email: store.email || '',
        phone: store.phone || '',
        city: store.address?.city || '',
        district: store.address?.district || '',
        ward: store.address?.ward || '',
        street: store.address?.street || '',
        isVerified: store.isVerified ?? false,
        isActive: store.isActive ?? true,
      })
      setLogo(store.logo || '')

      if (store.ownerId && typeof store.ownerId === 'object') {
        const owner = store.ownerId as any
        setSelectedOwner({ _id: owner._id, name: owner.name, email: owner.email })
      }

      if (store.address?.city) {
        const foundProv = provinces.find((p: any) => p.name.toLowerCase() === store.address!.city!.toLowerCase())
        if (foundProv) {
          setSelectedProvinceCode(foundProv.code)
        }
      }
      if (store.address?.district && selectedProvinceCode) {
        api.get(`/addresses/districts?provinceCode=${selectedProvinceCode}`).then((res) => {
          const distList = res.data.data || []
          setDistricts(distList)
          const foundDist = distList.find((d: any) => d.name.toLowerCase() === store.address!.district!.toLowerCase())
          if (foundDist) {
            setSelectedDistrictCode(foundDist.code)
          }
        }).catch(() => {})
      }
    }
  }, [isEdit, store, provinces])

  useEffect(() => {
    if (store?.address?.ward && selectedDistrictCode) {
      api.get(`/addresses/wards?districtCode=${selectedDistrictCode}`).then((res) => {
        setWards(res.data.data || [])
      }).catch(() => {})
    }
  }, [selectedDistrictCode, store?.address?.ward])

  const handleProvinceChange = (code: string) => {
    setSelectedProvinceCode(code)
    setSelectedDistrictCode('')
    setDistricts([])
    setWards([])
    const found = provinces.find((p) => p.code === code)
    setValue('city', found ? found.name : '')
    setValue('district', '')
    setValue('ward', '')
  }

  const handleDistrictChange = (code: string) => {
    setSelectedDistrictCode(code)
    setWards([])
    const found = districts.find((d) => d.code === code)
    setValue('district', found ? found.name : '')
    setValue('ward', '')
  }

  const handleWardChange = (code: string) => {
    const found = wards.find((w) => w.code === code)
    setValue('ward', found ? found.name : '')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCategoryImage(file)
      setLogo(imageUrl)
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm')
      return
    }
    setIsSearchingUsers(true)
    try {
      const data = await adminService.getUsers({ limit: 10, search: userSearchQuery })
      setSearchedUsers(data.users || [])
      if ((data.users || []).length === 0) toast.info('Không tìm thấy người dùng nào')
    } catch {
      toast.error('Lỗi khi tìm kiếm người dùng')
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleSelectOwner = (user: any) => {
    setSelectedOwner({ _id: user._id, name: user.name, email: user.email })
    setSearchedUsers([])
    setUserSearchQuery('')
    toast.success(`Đã chọn: ${user.name}`)
  }

  const onSubmit = async (data: StoreFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug || undefined,
      description: data.description || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      logo: logo || undefined,
      address: {
        city: data.city || undefined,
        district: data.district || undefined,
        ward: data.ward || undefined,
        street: data.street || undefined,
      },
      isVerified: data.isVerified,
      isActive: data.isActive,
    }

    if (!isEdit && !selectedOwner) {
      toast.error('Vui lòng chọn chủ sở hữu cho cửa hàng')
      return
    }

    try {
      if (isEdit) {
        await adminService.updateStore(id!, isEdit ? { ...payload, ownerId: undefined } : payload)
        toast.success('Cập nhật cửa hàng thành công')
      } else {
        await adminService.createStore({ ...payload, ownerId: selectedOwner!._id })
        toast.success('Thêm cửa hàng thành công')
      }
      navigate('/admin/stores')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  if (isEdit && isLoadingStore) {
    return <LoadingState className="min-h-[400px]" />
  }

  const selectedWardCode = wards.find(
    (w) => w.name.toLowerCase() === (watch('ward') || '').toLowerCase(),
  )?.code || ''

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/stores')}
          className="p-2 bg-card hover:bg-muted rounded-lg border border-border shadow-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? 'Chỉnh sửa cửa hàng' : 'Thêm cửa hàng mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit ? `Chỉnh sửa thông tin cho "${store?.name}"` : 'Nhập thông tin để tạo cửa hàng mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <SectionCard title="Thông tin cơ bản">
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="size-24 rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted relative group">
                  {logo ? (
                    <img src={logo} alt="Logo" className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <Store size={36} className="text-muted-foreground" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-card border border-border shadow-sm rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1">
                  <Upload size={14} /> Tải logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Tên cửa hàng <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Nhập tên cửa hàng..."
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
                  <input
                    {...register('slug')}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="tu-dong-tao-tu-ten"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Mô tả</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                placeholder="Nhập mô tả cửa hàng..."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thông tin liên hệ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                {...register('email')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="store@example.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Số điện thoại</label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="0123456789"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Địa chỉ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tỉnh / Thành phố</label>
              <select
                value={selectedProvinceCode}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {provinces.map((p: any) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Quận / Huyện</label>
              <select
                value={selectedDistrictCode}
                disabled={!selectedProvinceCode}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
              >
                <option value="">Chọn Quận / Huyện</option>
                {districts.map((d: any) => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phường / Xã</label>
              <select
                value={selectedWardCode}
                disabled={!selectedDistrictCode}
                onChange={(e) => handleWardChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
              >
                <option value="">Chọn Phường / Xã</option>
                {wards.map((w: any) => (
                  <option key={w.code} value={w.code}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Đường / Số nhà</label>
              <input
                {...register('street')}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Số nhà, tên đường..."
              />
            </div>
          </div>
        </SectionCard>

        {!isEdit && (
          <SectionCard title="Chủ sở hữu">
            <div className="space-y-3">
              {selectedOwner ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedOwner.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedOwner.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOwner(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchUsers() } }}
                      placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                    <button
                      type="button"
                      onClick={handleSearchUsers}
                      disabled={isSearchingUsers}
                      className="px-4 py-2 bg-foreground text-background hover:opacity-90 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {isSearchingUsers ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Search size={16} />
                      )}
                      Tìm kiếm
                    </button>
                  </div>
                  {searchedUsers.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-border rounded-lg divide-y bg-card">
                      {searchedUsers.map((user: any) => (
                        <div key={user._id} className="flex items-center justify-between p-2.5 hover:bg-muted">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectOwner(user)}
                            className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            Chọn
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </SectionCard>
        )}

        <SectionCard title="Trạng thái">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="size-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-sm text-foreground font-medium">Hoạt động</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isVerified')}
                className="size-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-sm text-foreground font-medium">Đã xác minh</span>
            </label>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/stores')}
            className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Cập nhật cửa hàng' : 'Tạo cửa hàng'}
          </button>
        </div>
      </form>
    </div>
  )
}
