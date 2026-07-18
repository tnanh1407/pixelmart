import { useState, useEffect } from 'react'
import { X, Loader2, Upload, Search, Check, Store } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { adminService } from '@/services/admin/admin.service'
import api from '@/services/api'
import { toast } from 'sonner'

interface StoreForm {
  name: string
  logo?: string
  description?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  isVerified: boolean
  isActive: boolean
  ownerId: string
}

interface StoreFormModalProps {
  showModal: boolean
  editingId: string | null
  form: StoreForm
  setForm: React.Dispatch<React.SetStateAction<StoreForm>>
  handleSubmit: (e: React.FormEvent) => void
  closeModal: () => void
  isPending: boolean
}

export default function StoreFormModal({
  showModal,
  editingId,
  form,
  setForm,
  handleSubmit,
  closeModal,
  isPending,
}: StoreFormModalProps) {
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [searchedUsers, setSearchedUsers] = useState<any[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedUserInfo, setSelectedUserInfo] = useState<string | null>(null)

  // Address Selector States
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('')
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('')

  useEffect(() => {
    const initAddressData = async () => {
      if (!showModal) return
      try {
        const provRes = await api.get('/addresses/provinces')
        const provList = provRes.data.data || []
        setProvinces(provList)
        setDistricts([])
        setWards([])
        setSelectedProvinceCode('')
        setSelectedDistrictCode('')

        if (editingId && form.address) {
          const currentCity = form.address.city || ''
          const foundProv = provList.find((p: any) => p.name.toLowerCase() === currentCity.toLowerCase())
          if (foundProv) {
            setSelectedProvinceCode(foundProv.code)
            const distRes = await api.get(`/addresses/districts?provinceCode=${foundProv.code}`)
            const distList = distRes.data.data || []
            setDistricts(distList)
            const currentDist = form.address.district || ''
            const foundDist = distList.find((d: any) => d.name.toLowerCase() === currentDist.toLowerCase())
            if (foundDist) {
              setSelectedDistrictCode(foundDist.code)
              const wardRes = await api.get(`/addresses/wards?districtCode=${foundDist.code}`)
              setWards(wardRes.data.data || [])
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin hành chính:', err)
      }
    }
    initAddressData()
  }, [showModal, editingId])

  useEffect(() => {
    if (showModal) {
      setUserSearchQuery('')
      setSearchedUsers([])
      setSelectedUserInfo(null)
    }
  }, [showModal])

  if (!showModal) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCategoryImage(file)
      setForm((prev) => ({ ...prev, logo: imageUrl }))
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      console.error(err)
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
    } catch (error) {
      console.error(error)
      toast.error('Lỗi khi tìm kiếm người dùng')
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleSelectUser = (user: any) => {
    setForm((prev) => ({ ...prev, ownerId: user._id }))
    setSelectedUserInfo(`${user.name} (${user.email})`)
    setSearchedUsers([])
    setUserSearchQuery('')
    toast.success(`Đã chọn chủ sở hữu: ${user.name}`)
  }

  const getOwnerDisplay = () => {
    if (!form.ownerId) return 'Chưa thiết lập'
    if (typeof form.ownerId === 'object' && form.ownerId !== null) {
      const owner = form.ownerId as any
      return (
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-text">{owner.name}</p>
          <p className="text-xs text-text-muted">{owner.email}</p>
          <p className="text-[10px] text-text-muted font-mono">ID: {owner._id}</p>
        </div>
      )
    }
    return <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">{form.ownerId}</code>
  }

  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode)
    setSelectedDistrictCode('')
    setDistricts([])
    setWards([])
    const foundProv = provinces.find((p) => p.code === provinceCode)
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, city: foundProv ? foundProv.name : '', district: '', ward: '' },
    }))
    if (!provinceCode) return
    try {
      const res = await api.get(`/addresses/districts?provinceCode=${provinceCode}`)
      setDistricts(res.data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi tải danh sách quận huyện')
    }
  }

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrictCode(districtCode)
    setWards([])
    const foundDist = districts.find((d) => d.code === districtCode)
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, district: foundDist ? foundDist.name : '', ward: '' },
    }))
    if (!districtCode) return
    try {
      const res = await api.get(`/addresses/wards?districtCode=${districtCode}`)
      setWards(res.data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi tải danh sách phường xã')
    }
  }

  const handleWardChange = (wardCode: string) => {
    const foundWard = wards.find((w) => w.code === wardCode)
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, ward: foundWard ? foundWard.name : '' },
    }))
  }

  const selectedWardCode = wards.find((w) => w.name.toLowerCase() === (form.address?.ward || '').toLowerCase())?.code || ''

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold text-text">
            {editingId ? 'Chỉnh sửa cửa hàng' : 'Thêm cửa hàng mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            {/* Logo & Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 relative group">
                {form.logo ? (
                  <img src={form.logo} alt="Logo" className="w-24 h-24 rounded-lg object-cover shadow-sm mb-2" />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center mb-2">
                    <Store size={36} className="text-text-muted" />
                  </div>
                )}
                <label className="cursor-pointer bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <Upload size={14} />
                  Tải logo lên
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Tên cửa hàng <span className="text-destructive">*</span></label>
                  <input type="text" required value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập tên cửa hàng..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                    <input type="email" value={form.email || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập email..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Số điện thoại</label>
                    <input type="text" value={form.phone || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập số điện thoại..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Mô tả</label>
              <textarea value={form.description || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                placeholder="Nhập mô tả cửa hàng..." />
            </div>

            {/* Address Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text border-b border-gray-100 pb-1">Địa chỉ cửa hàng</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Tỉnh / Thành phố</label>
                  <select value={selectedProvinceCode} onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    <option value="">Chọn Tỉnh / Thành phố</option>
                    {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Quận / Huyện</label>
                  <select value={selectedDistrictCode} disabled={!selectedProvinceCode} onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-50 disabled:text-text-muted">
                    <option value="">Chọn Quận / Huyện</option>
                    {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Phường / Xã</label>
                  <select value={selectedWardCode} disabled={!selectedDistrictCode} onChange={(e) => handleWardChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-50 disabled:text-text-muted">
                    <option value="">Chọn Phường / Xã</option>
                    {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Đường / Số nhà</label>
                  <input type="text" value={form.address?.street || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Đường / Số nhà..." />
                </div>
              </div>
            </div>

            {/* Owner Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text border-b border-gray-100 pb-1">
                Chủ sở hữu cửa hàng <span className="text-destructive">*</span>
              </h4>
              <div className="space-y-2">
                <div className="text-sm text-text bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex flex-col gap-1">
                  <div>
                    <span className="font-medium text-text block mb-1">Chủ sở hữu hiện tại:</span>
                    {getOwnerDisplay()}
                  </div>
                  {selectedUserInfo && (
                    <div className="text-primary font-medium flex items-center gap-1 mt-1 border-t border-gray-100 pt-1.5">
                      <Check size={14} /> Đã chọn mới: {selectedUserInfo}
                    </div>
                  )}
                </div>

                {!editingId && (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchUsers() } }} />
                      </div>
                      <button type="button" onClick={handleSearchUsers}
                        className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer">
                        <Search size={16} /> Tìm kiếm
                      </button>
                    </div>

                    {isSearchingUsers && (
                      <div className="flex items-center gap-2 text-sm text-text-muted py-1">
                        <Loader2 size={16} className="animate-spin text-primary" />
                        Đang tìm kiếm...
                      </div>
                    )}

                    {searchedUsers.length > 0 && (
                      <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50 shadow-sm bg-white">
                        {searchedUsers.map((user) => (
                          <div key={user._id} className="flex items-center justify-between p-2.5 hover:bg-gray-50">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-text truncate">{user.name}</p>
                              <p className="text-xs text-text-muted truncate">{user.email}</p>
                            </div>
                            <button type="button" onClick={() => handleSelectUser(user)}
                              className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors shrink-0 cursor-pointer">
                              Chọn
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text border-b border-gray-100 pb-1">Trạng thái hoạt động</h4>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                  <span className="text-sm text-text font-medium">Hoạt động (Active)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isVerified}
                    onChange={(e) => setForm((prev) => ({ ...prev, isVerified: e.target.checked }))}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                  <span className="text-sm text-text font-medium">Đã xác minh (Verified)</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white mx-0 mb-0 rounded-none border-x-0">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              Hủy
            </button>
            <button type="submit" disabled={isPending || isUploading || !form.ownerId || !form.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
