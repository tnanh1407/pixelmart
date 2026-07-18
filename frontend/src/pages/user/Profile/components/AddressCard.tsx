import { MapPin, Edit2, Trash2, Check } from 'lucide-react'
import { type Address } from '@/services/user/auth.service'

interface AddressCardProps {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (addressId: string) => void
  onSetDefault: (addressId: string) => void
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-300 ${
        address.isDefault
          ? 'border-primary/30 bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] shadow-sm border-l-4 border-l-primary'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${
          address.isDefault ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'
        }`}>
          <MapPin size={20} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-gray-800 text-[15px]">{address.receiverName}</span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-gray-500 text-sm font-medium">{address.receiverPhone}</span>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white shadow-sm shadow-primary/20">
                <Check size={10} className="stroke-[3]" /> Mặc định
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-700">{address.streetAddress}</p>
            <p className="text-gray-400 text-xs">
              {address.wardName}, {address.districtName}, {address.provinceName}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0 self-stretch justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(address)}
              title="Chỉnh sửa"
              className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <Edit2 size={15} />
            </button>
            {!address.isDefault && (
              <button
                onClick={() => onDelete(address._id!)}
                title="Xóa"
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address._id!)}
              className="text-[11px] font-bold text-gray-500 hover:text-primary hover:bg-primary/5 hover:border-primary/40 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-200 bg-white"
            >
              Thiết lập mặc định
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
