import { useState } from 'react'
import { Gift, Truck, X } from 'lucide-react'

const vouchers = [
  {
    id: 1,
    code: 'ZMACTV3',
    description: 'Đơn hàng từ 1.000',
    expiry: '31/12/2026',
    type: 'discount',
    minOrder: 1000,
    maxDiscount: 50000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả sản phẩm',
  },
  {
    id: 2,
    code: 'SALE20',
    description: 'Giảm 20% cho đơn từ 500k',
    expiry: '31/12/2026',
    type: 'discount',
    minOrder: 500000,
    maxDiscount: 200000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả sản phẩm',
  },
  {
    id: 3,
    code: 'GIAM50K',
    description: 'Giảm 50.000đ cho đơn từ 1.000.000đ',
    expiry: '15/08/2026',
    type: 'discount',
    minOrder: 1000000,
    maxDiscount: 50000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả sản phẩm',
  },
  {
    id: 4,
    code: 'SALE10',
    description: 'Giảm 10% cho đơn từ 200k',
    expiry: '30/09/2026',
    type: 'discount',
    minOrder: 200000,
    maxDiscount: 100000,
    usageLimit: 'Mỗi tài khoản sử dụng 2 lần',
    applicableProducts: 'Áp dụng cho tất cả sản phẩm',
  },
  {
    id: 5,
    code: 'GIAM100K',
    description: 'Giảm 100.000đ cho đơn từ 2.000.000đ',
    expiry: '31/12/2026',
    type: 'discount',
    minOrder: 2000000,
    maxDiscount: 100000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả sản phẩm',
  },
  {
    id: 6,
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn từ 300k',
    expiry: '31/12/2026',
    type: 'shipping',
    minOrder: 300000,
    maxDiscount: 30000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả đơn hàng',
  },
  {
    id: 7,
    code: 'SHIP0',
    description: 'Miễn phí vận chuyển toàn bộ đơn hàng',
    expiry: '30/06/2026',
    type: 'shipping',
    minOrder: 0,
    maxDiscount: 50000,
    usageLimit: 'Mỗi tài khoản sử dụng 1 lần',
    applicableProducts: 'Áp dụng cho tất cả đơn hàng',
  },
  {
    id: 8,
    code: 'SHIP50',
    description: 'Giảm 50% phí vận chuyển cho đơn từ 150k',
    expiry: '31/08/2026',
    type: 'shipping',
    minOrder: 150000,
    maxDiscount: 25000,
    usageLimit: 'Mỗi tài khoản sử dụng 3 lần',
    applicableProducts: 'Áp dụng cho tất cả đơn hàng',
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export default function Pointmallvoucher() {
  const [activeTab, setActiveTab] = useState<'discount' | 'shipping'>('discount')
  const [selectedVoucher, setSelectedVoucher] = useState<typeof vouchers[0] | null>(null)

  const filteredVouchers = vouchers.filter((v) => v.type === activeTab)

  return (
    <div className="w-full max-w-350 mx-auto">
      {/* Banner */}
      <div className="relative w-full h-35 rounded-b-2xl overflow-hidden">
        <img src="/Pointmallvoucher/banner_Pointmallvoucher.png" alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-end pr-12">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Mã giảm giá</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-4 rounded-t-xl">
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('discount')}
            className={`px-4 py-3 text-base font-medium transition-colors relative ${
              activeTab === 'discount' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Giảm giá
            {activeTab === 'discount' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-3 text-base font-medium transition-colors relative ${
              activeTab === 'shipping' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vận chuyển
            {activeTab === 'shipping' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Voucher List */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Gift size={64} className="mb-4 opacity-40" />
              <p className="text-sm">Chưa có voucher nào</p>
            </div>
          ) : (
            filteredVouchers.map((voucher) => (
              <div key={voucher.id} className="flex items-stretch bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Icon Section */}
                <div className="flex flex-col items-center justify-center bg-secondary px-5 py-4 w-25 relative">
                  <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full -translate-x-1.5" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full -translate-x-1.5" />
                  <div className="text-white mb-1">
                    {voucher.type === 'discount' ? <Gift size={36} /> : <Truck size={36} />}
                  </div>
                  <span className="text-white text-xs font-semibold text-center leading-tight">
                    {voucher.type === 'discount' ? 'Quà tặng' : 'Vận chuyển'}
                  </span>
                </div>

                {/* Voucher Info */}
                <div className="w-1/2 px-4 py-3 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{voucher.code}</h3>
                  <p className="text-sm text-gray-500 mb-2">{voucher.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Hạn sử dụng: {voucher.expiry}</span>
                    <span
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => setSelectedVoucher(voucher)}
                    >
                      Điều kiện
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center ml-18">
                  <button className="px-5 py-2 border border-primary text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-colors whitespace-nowrap">
                    Lưu ngay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedVoucher(null)}>
          <div className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Điều kiện voucher</h2>
              <button onClick={() => setSelectedVoucher(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-xl">
                  {selectedVoucher.type === 'discount' ? <Gift size={24} className="text-white" /> : <Truck size={24} className="text-white" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedVoucher.code}</h3>
                  <p className="text-sm text-gray-500">{selectedVoucher.description}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Đơn tối thiểu</span>
                  <span className="font-medium text-gray-900">{formatPrice(selectedVoucher.minOrder)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giảm tối đa</span>
                  <span className="font-medium text-gray-900">{formatPrice(selectedVoucher.maxDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hạn sử dụng</span>
                  <span className="font-medium text-gray-900">{selectedVoucher.expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số lần sử dụng</span>
                  <span className="font-medium text-gray-900">{selectedVoucher.usageLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Áp dụng cho</span>
                  <span className="font-medium text-gray-900">{selectedVoucher.applicableProducts}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-full py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
