import AvatarUpload from '@/components/common/AvatarUpload'
import ProfileHeader from './components/ProfileHeader'
import ProfileInfoSection from './components/ProfileInfoSection'
import AddressSection from './components/AddressSection'
import useProfileHandlers from './useProfileHandlers'

export default function ProfilePage() {
  const {
    handleChangePassword,
    handleChangeName,
    handleChangeGender,
    handleChangeDob,
    handleChangePhone,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleEditAddress,
  } = useProfileHandlers()

  const handleAction = (label: string) => {
    switch (label) {
      case 'Mật khẩu': return handleChangePassword()
      case 'Họ và tên': return handleChangeName()
      case 'Giới tính': return handleChangeGender()
      case 'Ngày sinh': return handleChangeDob()
      case 'Số điện thoại': return handleChangePhone()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ProfileHeader />

      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Ảnh đại diện</h1>

        <div className="mb-8">
          <AvatarUpload />
        </div>

        <ProfileInfoSection onAction={handleAction} />

        <hr className="my-6 border-gray-200" />

        <AddressSection
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
          onSetDefaultAddress={handleSetDefaultAddress}
        />
      </div>
    </div>
  )
}
