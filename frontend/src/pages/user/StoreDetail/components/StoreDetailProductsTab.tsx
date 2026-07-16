import { TrendingUp, Sparkles, Clock, Package } from 'lucide-react'
import type { IProduct } from '@/types/product.types'
import { mapProductToCard } from './mapProductToCard'
import ProductCard from '@/components/common/ProductCard'

interface StoreDetailProductsTabProps {
  type: 'bestseller' | 'featured' | 'new' | 'all'
  products: IProduct[]
  totalCount: number
}

const config = {
  bestseller: { label: 'Sản phẩm bán chạy', icon: <TrendingUp size={20} className="text-[#009b4d]" /> },
  featured: { label: 'Sản phẩm nổi bật', icon: <Sparkles size={20} className="text-amber-500" /> },
  new: { label: 'Sản phẩm mới', icon: <Clock size={20} className="text-blue-500" /> },
  all: { label: 'Tất cả hàng hóa', icon: <Package size={20} className="text-[#009b4d]" /> },
}

export default function StoreDetailProductsTab({ type, products, totalCount }: StoreDetailProductsTabProps) {
  const { label, icon } = config[type]

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        {icon}
        {label} {type === 'all' ? `(${totalCount})` : ''}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={mapProductToCard(product)} />
        ))}
      </div>
    </section>
  )
}
