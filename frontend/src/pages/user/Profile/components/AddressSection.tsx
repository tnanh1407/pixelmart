import { Plus, MapPin } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { type Address } from '@/services/user/auth.service'
import AddressCard from './AddressCard'

interface AddressSectionProps {
  onAddAddress: () => void
  onEditAddress: (address: Address) => void
  onDeleteAddress: (addressId: string) => void
  onSetDefaultAddress: (addressId: string) => void
}

export default function AddressSection({
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: AddressSectionProps) {
  const { user } = useUserStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Địa chỉ giao hàng</h2>
        <button
          onClick={onAddAddress}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {user?.addresses && user.addresses.length > 0 ? (
        <div className="space-y-4">
          {user.addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={onEditAddress}
              onDelete={onDeleteAddress}
              onSetDefault={onSetDefaultAddress}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Chưa có địa chỉ giao hàng nào</p>
        </div>
      )}
    </div>
  )
}
