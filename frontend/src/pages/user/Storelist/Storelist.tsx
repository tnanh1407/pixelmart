import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, BadgeCheck, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { stores, provinces } from '../../../data/products'

const categories = ['Tất cả', 'OCOP', 'Nông sản và Thực phẩm', 'Sức khỏe và làm đẹp']

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const ITEMS_PER_PAGE = 10

export default function Storelist() {
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('')
  const [shopType, setShopType] = useState<'all' | 'normal' | 'mall'>('all')
  const [category, setCategory] = useState('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE)
  const paginatedStores = stores.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="w-full max-w-350 mx-auto">
      {/* Banner */}
      <div className="relative w-full h-35 rounded-b-2xl overflow-hidden">
        <img src="/Pointmallvoucher/banner_Pointmallvoucher.png" alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-end pr-12">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Khám phá gian hàng</h1>
        </div>
      </div>

      <div className="flex gap-6 py-6">
        {/* Sidebar */}
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
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
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

            {/* Phân loại */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Phân loại</label>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="w-4 h-4 rounded border-gray-300 text-primary accent-primary"
                    />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSearch('')
                  setProvince('')
                  setShopType('all')
                  setCategory('Tất cả')
                }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </button>
              <button className="flex-1 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors">
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Store List */}
        <div className="flex-1 space-y-6">
          {paginatedStores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              {/* Store Header */}
              <div className="flex items-center justify-between p-5 border-b border-white bg-[url('/core/background.jpg')] bg-cover bg-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0  overflow-hidden bg-gray-100 rounded-full">
                    <img src={store.avatar} alt={store.name} className="w-full h-full object-cover " />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-2xl font-bold text-black">{store.name}</h3>
                      {store.trusted && (
                        <BadgeCheck size={24} className="text-primary fill-green-100" />
                      )}
                    </div>
                    <p className="text-xs text-gray">Sản phẩm đã bán: {store.sold}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{store.products.length}</p>
                    <p className="text-sm text-black font-medium">Mặt hàng</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star size={14} className="text-secondary fill-secondary" />
                      <p className="text-xl font-bold text-secondary">{store.rating}</p>
                    </div>
                    <p className="text-sm text-black font-medium">Đánh giá</p>
                  </div>
                  <Link to={`/store/${store.id}`} className="px-5 py-2 border border-primary text-primary text-base font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Xem shop
                  </Link>
                </div>
              </div>

              {/* Products Preview */}
              {store.products.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 px-5 pb-5 mt-2">
                  {store.products.slice(0, 3).map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{product.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                            {product.discount > 0 && (
                              <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                  <PackageOpen size={20} />
                  <p className="text-sm">Chưa có sản phẩm nào</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
