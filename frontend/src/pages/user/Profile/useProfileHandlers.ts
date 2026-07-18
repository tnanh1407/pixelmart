import Swal from 'sweetalert2'
import useUserStore from '@/stores/useUserStore'
import { authService, type Address } from '@/services/user/auth.service'
import api from '@/services/api'
import {
  ADDRESS_SWAL_CONFIG,
  LOADING_ALERT,
  SUCCESS_ALERT,
  ERROR_ALERT,
  showProfileFieldPopup,
  getAddressFormHtml,
  validateAddressForm,
  initAddressFormDidOpen,
  initEditAddressFormDidOpen,
  loadGoongSDK,
} from './profileHelpers'

export default function useProfileHandlers() {
  const { user, setUser } = useUserStore()

  // ── Profile field handlers ─────────────────────────────────────

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Đổi mật khẩu',
      html: `
        <div class="text-left" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Mật khẩu hiện tại</label>
            <input id="swal-current-password" type="password" placeholder="Nhập mật khẩu hiện tại"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Mật khẩu mới</label>
            <input id="swal-new-password" type="password" placeholder="Nhập mật khẩu mới"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Nhập lại mật khẩu mới</label>
            <input id="swal-confirm-password" type="password" placeholder="Nhập lại mật khẩu mới"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#049645',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6 !ml-2',
        cancelButton: '!rounded-lg !px-6',
        actions: '!gap-2',
      },
      preConfirm: () => {
        const currentPassword = (document.getElementById('swal-current-password') as HTMLInputElement)?.value
        const newPassword = (document.getElementById('swal-new-password') as HTMLInputElement)?.value
        const confirmPassword = (document.getElementById('swal-confirm-password') as HTMLInputElement)?.value

        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin')
          return false
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
          return false
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Mật khẩu mới không khớp')
          return false
        }
        return { currentPassword, newPassword, confirmPassword }
      },
    })

    if (formValues) {
      try {
        await authService.changePassword(
          formValues.currentPassword,
          formValues.newPassword,
          formValues.confirmPassword
        )
        SUCCESS_ALERT('Đổi mật khẩu thành công')
      } catch (err: any) {
        ERROR_ALERT(err?.response?.data?.message || 'Đổi mật khẩu thất bại')
      }
    }
  }

  const handleChangeName = () =>
    showProfileFieldPopup({
      title: 'Đổi họ và tên',
      html: `
        <div class="text-left" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Họ và tên mới</label>
            <input id="swal-name" type="text" value="${user?.name || ''}" placeholder="Nhập họ và tên mới"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
        </div>
      `,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement)?.value
        if (!name || name.trim().length < 2) {
          Swal.showValidationMessage('Họ và tên phải có ít nhất 2 ký tự')
          return false
        }
        const cleanNewName = name.replace(/\s+/g, '')
        const cleanOldName = (user?.name || '').replace(/\s+/g, '')
        if (cleanNewName === cleanOldName) {
          Swal.showValidationMessage('Họ và tên mới phải khác họ và tên hiện tại')
          return false
        }
        return { name: name.trim() }
      },
      onSuccess: async (fv) => {
        const updatedUser = await authService.updateProfile({ name: fv.name })
        setUser(updatedUser)
      },
      successMessage: 'Đổi họ và tên thành công',
      errorMessage: 'Đổi họ và tên thất bại',
    })

  const handleChangeGender = () =>
    showProfileFieldPopup({
      title: 'Đổi giới tính',
      html: `
        <div class="text-left" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Giới tính</label>
            <select id="swal-gender"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;background:#fff;">
              <option value="male" ${user?.gender === 'male' ? 'selected' : ''}>Nam</option>
              <option value="female" ${user?.gender === 'female' ? 'selected' : ''}>Nữ</option>
              <option value="other" ${user?.gender === 'other' ? 'selected' : ''}>Khác</option>
            </select>
          </div>
        </div>
      `,
      preConfirm: () => {
        const gender = (document.getElementById('swal-gender') as HTMLSelectElement)?.value
        if (!gender) {
          Swal.showValidationMessage('Vui lòng chọn giới tính')
          return false
        }
        return { gender }
      },
      onSuccess: async (fv) => {
        const updatedUser = await authService.updateProfile({ gender: fv.gender })
        setUser(updatedUser)
      },
      successMessage: 'Đổi giới tính thành công',
      errorMessage: 'Đổi giới tính thất bại',
    })

  const handleChangeDob = () => {
    const d = user?.dob ? new Date(user.dob) : null
    const currentDob = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      : ''

    return showProfileFieldPopup({
      title: 'Đổi ngày sinh',
      html: `
        <div class="text-left" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Chọn ngày sinh mới</label>
            <input id="swal-dob" type="date" value="${currentDob}" max="${new Date().toISOString().split('T')[0]}"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
        </div>
      `,
      preConfirm: () => {
        const dob = (document.getElementById('swal-dob') as HTMLInputElement)?.value
        if (!dob) {
          Swal.showValidationMessage('Vui lòng chọn ngày sinh')
          return false
        }
        if (dob === currentDob) {
          Swal.showValidationMessage('Ngày sinh mới phải khác ngày sinh hiện tại')
          return false
        }
        return { dob }
      },
      onSuccess: async (fv) => {
        const updatedUser = await authService.updateProfile({ dob: fv.dob })
        setUser(updatedUser)
      },
      successMessage: 'Đổi ngày sinh thành công',
      errorMessage: 'Đổi ngày sinh thất bại',
    })
  }

  const handleChangePhone = () =>
    showProfileFieldPopup({
      title: 'Đổi số điện thoại',
      html: `
        <div class="text-left" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px;">Số điện thoại mới</label>
            <input id="swal-phone" type="text" value="${user?.phone || ''}" placeholder="Nhập số điện thoại mới"
              style="width:100%;padding:10px 14px;font-size:14px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
          </div>
        </div>
      `,
      preConfirm: () => {
        const phone = (document.getElementById('swal-phone') as HTMLInputElement)?.value.trim()
        if (!phone) {
          Swal.showValidationMessage('Vui lòng nhập số điện thoại')
          return false
        }
        if (!/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
          Swal.showValidationMessage('Số điện thoại không hợp lệ')
          return false
        }
        if (phone === user?.phone) {
          Swal.showValidationMessage('Số điện thoại mới phải khác số hiện tại')
          return false
        }
        return { phone }
      },
      onSuccess: async (fv) => {
        const updatedUser = await authService.updateProfile({ phone: fv.phone })
        setUser(updatedUser)
      },
      successMessage: 'Đổi số điện thoại thành công',
      errorMessage: 'Đổi số điện thoại thất bại',
    })

  // ── Address handlers ───────────────────────────────────────────

  const handleAddAddress = async () => {
    let provinces: any[] = []
    let activeDistricts: any[] = []
    let activeWards: any[] = []

    const goongjs = await loadGoongSDK()

    try {
      LOADING_ALERT()
      const res = await api.get('/addresses/provinces')
      provinces = res.data.data
      Swal.close()
    } catch {
      ERROR_ALERT('Không thể tải danh sách tỉnh thành')
      return
    }

    const { value: formValues } = await Swal.fire({
      title: 'Thêm địa chỉ mới',
      width: '900px',
      html: getAddressFormHtml({ provinces, activeDistricts, activeWards }),
      ...ADDRESS_SWAL_CONFIG,
      didOpen: initAddressFormDidOpen({
        provinces,
        activeDistricts,
        activeWards,
        setDistricts: (d) => { activeDistricts = d },
        setWards: (w) => { activeWards = w },
        goongjs,
      }),
      preConfirm: () => validateAddressForm(provinces, activeDistricts, activeWards),
    })

    if (formValues) {
      try {
        LOADING_ALERT('Đang lưu...')
        const updatedAddresses = await authService.addAddress(formValues)
        if (user) setUser({ ...user, addresses: updatedAddresses })
        SUCCESS_ALERT('Thêm địa chỉ giao hàng mới thành công')
      } catch (err: any) {
        ERROR_ALERT(err?.response?.data?.message || 'Thêm địa chỉ thất bại')
      }
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa địa chỉ này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa đi',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: '!rounded-2xl',
        confirmButton: '!rounded-xl !px-5 !py-2.5 !text-sm !font-semibold',
        cancelButton: '!rounded-xl !px-5 !py-2.5 !text-sm !font-semibold',
      }
    })

    if (result.isConfirmed) {
      try {
        LOADING_ALERT('Đang xóa...')
        const updatedAddresses = await authService.deleteAddress(addressId)
        if (user) setUser({ ...user, addresses: updatedAddresses })
        SUCCESS_ALERT('Xóa địa chỉ giao hàng thành công')
      } catch (err: any) {
        ERROR_ALERT(err?.response?.data?.message || 'Xóa địa chỉ thất bại')
      }
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      LOADING_ALERT('Đang cập nhật...')
      const updatedAddresses = await authService.setDefaultAddress(addressId)
      if (user) setUser({ ...user, addresses: updatedAddresses })
      SUCCESS_ALERT('Đã thay đổi địa chỉ mặc định')
    } catch (err: any) {
      ERROR_ALERT(err?.response?.data?.message || 'Cập nhật địa chỉ mặc định thất bại')
    }
  }

  const handleEditAddress = async (address: Address) => {
    let provinces: any[] = []
    let activeDistricts: any[] = []
    let activeWards: any[] = []

    const goongjs = await loadGoongSDK()

    try {
      LOADING_ALERT()
      const resProvinces = await api.get('/addresses/provinces')
      provinces = resProvinces.data.data
      const resDistricts = await api.get(`/addresses/districts?provinceCode=${address.provinceCode}`)
      activeDistricts = resDistricts.data.data
      const resWards = await api.get(`/addresses/wards?districtCode=${address.districtCode}`)
      activeWards = resWards.data.data
      Swal.close()
    } catch {
      ERROR_ALERT('Không thể tải danh sách địa lý hành chính')
      return
    }

    const { value: formValues } = await Swal.fire({
      title: 'Chỉnh sửa địa chỉ',
      width: '900px',
      html: getAddressFormHtml({ provinces, activeDistricts, activeWards, address }),
      ...ADDRESS_SWAL_CONFIG,
      confirmButtonText: 'Lưu thay đổi',
      didOpen: initEditAddressFormDidOpen({
        address,
        provinces,
        activeDistricts,
        activeWards,
        setDistricts: (d) => { activeDistricts = d },
        setWards: (w) => { activeWards = w },
        goongjs,
      }),
      preConfirm: () => validateAddressForm(provinces, activeDistricts, activeWards),
    })

    if (formValues) {
      try {
        LOADING_ALERT('Đang lưu thay đổi...')
        const updatedAddresses = await authService.updateAddress(address._id!, formValues)
        if (user) setUser({ ...user, addresses: updatedAddresses })
        SUCCESS_ALERT('Cập nhật địa chỉ giao hàng thành công')
      } catch (err: any) {
        ERROR_ALERT(err?.response?.data?.message || 'Cập nhật địa chỉ thất bại')
      }
    }
  }

  return {
    handleChangePassword,
    handleChangeName,
    handleChangeGender,
    handleChangeDob,
    handleChangePhone,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleEditAddress,
  }
}
