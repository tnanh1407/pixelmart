import { useState } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, Tag } from 'lucide-react'

const initialCartItems = [
  {
    id: 1,
    name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    price: 250000,
    originalPrice: 275000,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Combo thịt gác bếp Cao Lan',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    price: 289000,
    originalPrice: 345000,
    quantity: 1,
  },
  {
    id: 3,
    name: 'OCOP - Mật Ong Đông Trùng Hạ Thảo Tam Đào - Hũ 400g',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    price: 250000,
    originalPrice: 380000,
    quantity: 3,
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(cartItems.map((item) => item.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id))
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalOriginal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const totalSaved = totalOriginal - subtotal
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const voucherDiscount = 0
  const total = subtotal + shippingFee - voucherDiscount

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-350 mx-auto py-16">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <ShoppingBag size={80} className="mb-6 opacity-40" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Giỏ hàng trống</h2>
          <p className="text-sm text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
          <a
            href="/"
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-350 mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng ({cartItems.length})</h1>

      {/* Select All */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 mb-3 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            className="w-5 h-5 rounded border-gray-300 text-primary accent-primary cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Chọn tất cả ({cartItems.length} sản phẩm)</span>
        </label>
      </div>

      <div className="flex gap-6">
        {/* Cart Items */}
        <div className="flex-1 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all ${
                selectedIds.includes(item.id)
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              {/* Checkbox */}
              <div className="flex items-center px-4 shrink-0">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 rounded border-gray-300 text-primary accent-primary cursor-pointer"
                />
              </div>

              {/* Image */}
              <div className="w-28 h-28 shrink-0 overflow-hidden rounded-xl">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 px-5 py-4 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-1 mb-1.5">{item.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-primary font-bold text-lg">{formatPrice(item.price)}</span>
                  <span className="text-gray-400 text-sm line-through">{formatPrice(item.originalPrice)}</span>
                  <span className="bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded">
                    -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary rounded-full transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-9 text-center text-base font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary rounded-full transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Right: Total + Delete */}
              <div className="flex items-center gap-3 px-5 shrink-0">
                <span className="text-base font-bold text-gray-900 whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-[320px] shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            {/* Voucher */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
              <Tag size={16} className="text-primary shrink-0" />
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
              />
              <button className="text-primary text-sm font-medium hover:underline whitespace-nowrap">
                Áp dụng
              </button>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Đã chọn</span>
                <span className="font-medium text-gray-900">{selectedIds.length}/{cartItems.length} sản phẩm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium text-gray-900">
                  {selectedIds.length === 0 ? (
                    <span className="text-gray-400">---</span>
                  ) : shippingFee === 0 ? (
                    <span className="text-primary">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Giảm voucher</span>
                <span className="font-medium text-gray-900">
                  {selectedIds.length === 0 ? (
                    <span className="text-gray-400">---</span>
                  ) : voucherDiscount > 0 ? (
                    <span className="text-primary">-{formatPrice(voucherDiscount)}</span>
                  ) : (
                    '0đ'
                  )}
                </span>
              </div>
              {totalSaved > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tiết kiệm</span>
                  <span className="font-medium text-primary">-{formatPrice(totalSaved)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                <span className="text-base font-bold text-primary">
                  {selectedIds.length === 0 ? '0đ' : formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              disabled={selectedIds.length === 0}
              className={`w-full py-3 font-bold rounded-xl transition-colors ${
                selectedIds.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              Thanh toán ({totalQuantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
