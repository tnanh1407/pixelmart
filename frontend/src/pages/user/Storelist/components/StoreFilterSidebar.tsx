import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/client'

interface StoreFilterSidebarProps {
  search: string
  setSearch: (value: string) => void
  province: string
  setProvince: (value: string ) => void
  shopType: 'all' | 'normal' | 'mall'
  setShopType: (value: 'all' | 'normal' | 'mall') => void
  category: string[]
  setCategory: (value: string[]) => void
  onApply: () => void
  onReset: () => void
}

export default function StoreFilterSidebar({
  search,
  setSearch,
  province,
  setProvince,
  shopType,
  setShopType,
  onApply,
  onReset,
}: StoreFilterSidebarProps) {
  const { data: provinces = [] } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => api.get('/addresses/provinces').then(res => res.data.data),
  })

  return (
    <div className="w-70 shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Bộ lọc</h2>

        {/* Tên cửa hàng */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Tên cửa hàng</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tỉnh/Thành phố */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Tỉnh/Thành phố</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none bg-white"
          >
            <option value="">--Chọn tỉnh/thành phố--</option>
            {provinces.map((p : any) => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Sắp xếp theo */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Sắp xếp theo</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="shopType"
                checked={shopType === 'all'}
                onChange={() => setShopType('all')}
                className="w-4 h-4 border-gray-300 text-primary accent-primary"
              />
              <span className="text-sm text-gray-600">Tất cả</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="shopType"
                checked={shopType === 'normal'}
                onChange={() => setShopType('normal')}
                className="w-4 h-4 border-gray-300 text-primary accent-primary"
              />
              <span className="text-sm text-gray-600">Shop thường</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="shopType"
                checked={shopType === 'mall'}
                onChange={() => setShopType('mall')}
                className="w-4 h-4 border-gray-300 text-primary accent-primary"
              />
              <span className="text-sm text-gray-600">Mall</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  )
}
