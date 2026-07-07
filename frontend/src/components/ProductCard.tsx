import { Star, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface Product {
  id: number
  name: string
  image: string
  salePrice: number
  originalPrice?: number | null
  discount?: number
  rating?: number
  reviews?: number
  sold?: number
  badge?: string
  category?: string
  shopName?: string
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-amber-600 flex items-center justify-center rounded-bl-2xl rounded-br-2xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {(product.discount ?? 0) > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-base font-bold px-2 py-1">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          {/* Name */}
          <h3 className="text-base font-medium text-gray-800 line-clamp-2 h-12 group-hover:text-primary-hover transition-colors duration-300">
            {product.name}
          </h3>

          <div>          {product.category && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-green-50 text-primary border border-green-100 whitespace-nowrap">
              {product.category}
            </span>
          )}</div>

          <div>
            {product.shopName && (
              <span className="flex items-center gap-1 text-xs text-gray-500 truncate min-w-0">
                <Store size={12} className="shrink-0 text-gray-400" />
                <span className="truncate">{product.shopName}</span>
              </span>
            )}</div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-[#009b4d] font-bold text-base">
              {formatPrice(product.salePrice)}
            </span>
          </div>

          {/* Rating / Sold */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.rating != null && (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-gray-700">{product.rating}</span>
              </div>
            )}
            {product.reviews != null && (
              <span className="text-gray-400 text-xs">({product.reviews})</span>
            )}
            {product.sold != null && (
              <span className="text-gray-400 text-xs">
                | Đã bán {product.sold > 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
