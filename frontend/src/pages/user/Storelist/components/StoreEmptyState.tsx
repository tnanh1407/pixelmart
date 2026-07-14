import { Search } from 'lucide-react'

export default function StoreEmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
      <Search size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-lg font-medium">Không tìm thấy cửa hàng nào</p>
      <p className="text-sm text-gray-400 mt-1">Vui lòng điều chỉnh lại bộ lọc hoặc tìm kiếm khác</p>
    </div>
  )
}
