import {type StoreListResponse } from '@/services/admin/admin.service'
import { Trash2, CheckCircle, XCircle, Loader2, Store, Edit } from 'lucide-react'

type StoreItem = StoreListResponse['stores'][number]

interface StoresTableProps {
  stores: StoreItem[]
  isLoading: boolean
  onToggleVerified: (id: string) => void
  isToggleVerifiedPending: boolean
  onToggleActive: (id: string) => void
  isToggleActivePending: boolean
  onEdit: (store: StoreItem) => void
  onDelete: (id: string) => void
  isDeletePending: boolean
}

export default function StoresTable({
  stores,
  isLoading,
  onToggleVerified,
  isToggleVerifiedPending,
  onToggleActive,
  isToggleActivePending,
  onEdit,
  onDelete,
  isDeletePending,
}: StoresTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-20">
        <Store size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Không tìm thấy cửa hàng nào</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cửa hàng</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Liên hệ</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Đánh giá</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
            <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {stores.map((store) => (
            <tr key={store._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {store.logo ? (
                      <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store size={18} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.email || 'N/A'}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{store.phone || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {store.ratingsAverage?.toFixed(1) || '0.0'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      store.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {store.isActive ? 'Hoạt động' : 'Ẩn'}
                  </span>
                  {store.isVerified && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Đã xác minh
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onToggleVerified(store._id)}
                    disabled={isToggleVerifiedPending}
                    className={`p-1.5 rounded-lg transition-colors ${
                      store.isVerified ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={store.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => onToggleActive(store._id)}
                    disabled={isToggleActivePending}
                    className={`p-1.5 rounded-lg transition-colors ${
                      store.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={store.isActive ? 'Ẩn cửa hàng' : 'Hiện cửa hàng'}
                  >
                    {store.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </button>
                   <button
                    onClick={() => onEdit(store)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa cửa hàng này?')) {
                        onDelete(store._id)
                      }
                    }}
                    disabled={isDeletePending}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
