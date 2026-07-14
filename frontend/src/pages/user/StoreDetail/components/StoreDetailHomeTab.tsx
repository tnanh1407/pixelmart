import { Info, ChevronRight } from 'lucide-react'
import type { IStore } from '@/types/store.types'
import type { IProduct } from '@/types/product.types'
import { mapProductToCard } from './mapProductToCard'
import ProductCard from '@/components/ProductCard'

interface StoreDetailHomeTabProps {
  store: IStore
  products: IProduct[]
  onShowAll: () => void
}

export default function StoreDetailHomeTab({ store, products, onShowAll }: StoreDetailHomeTabProps) {
  const hotDeals = products.filter((p) => p.discountPrice).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* About Shop */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 capitalize">
          <Info size={22} className="text-primary" />
          Giới thiệu shop
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Mô tả</h3>
            <p className="text-gray-700 leading-relaxed">{store.description || 'Chưa có mô tả'}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Chính sách</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              {store.policies && store.policies.length > 0 ? (
                store.policies.map((policy, idx) => (
                  <p key={idx} className="flex items-center gap-2">✅ {policy}</p>
                ))
              ) : (
                <>
                  <p className="flex items-center gap-2">✅ Đổi trả trong 7 ngày nếu sản phẩm lỗi</p>
                  <p className="flex items-center gap-2">✅ Hoàn tiền 100% nếu không nhận hàng</p>
                  <p className="flex items-center gap-2">✅ Hỗ trợ khách hàng 24/7</p>
                  <p className="flex items-center gap-2">✅ Miễn phí vận chuyển cho đơn từ 500.000đ</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended For You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold uppercase text-primary">Đề xuất cho bạn</h2>
          <button onClick={onShowAll} className="flex items-center gap-1 text-[#009b4d] text-sm font-medium hover:underline">
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={mapProductToCard(product)} />
          ))}
        </div>
      </section>

      {/* Hot Deals */}
      {hotDeals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 uppercase">Ưu đãi hot</h2>
            <button onClick={onShowAll} className="flex items-center gap-1 text-[#009b4d] text-sm font-medium hover:underline">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {hotDeals.map((product) => (
              <ProductCard key={product._id} product={mapProductToCard(product)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
