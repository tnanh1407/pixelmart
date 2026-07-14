import { Star, Store, Zap } from 'lucide-react'
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
  const hasDiscount = (product.discount ?? 0) > 0 || (product.originalPrice && product.originalPrice > product.salePrice);
  const discountPercent = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0);

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-[10px] border border-[#e9e9e9] overflow-hidden hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 pb-3 relative">
        {/* FlashSale tag (top-left absolute) */}
        {(product.badge === 'FlashSale' || product.badge === 'flashsale' || hasDiscount) && (
          <div className="absolute left-0 top-0 bg-[#de0000] text-white text-[10px] px-2.5 py-1.5 rounded-tl-[10px] rounded-br-[15px] font-medium flex items-center gap-0.5 z-10">
            <Zap size={10} className="fill-white text-white" />
            <span>FlashSale</span>
          </div>
        )}

        {/* Image wrapper */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center rounded-t-[10px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content wrapper */}
        <div className="px-3 pt-3 flex flex-col">
          {/* Title */}
          <h3 className="text-[#2d2d2d] font-bold text-sm leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors duration-200 text-left">
            {product.name}
          </h3>

          {/* Original price block */}
          {hasDiscount && product.originalPrice ? (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="line-through text-gray-400 text-xs">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="bg-[#049645] text-white text-[8.5px] px-1.5 py-0.5 rounded-full font-bold uppercase scale-90 origin-left">
                giảm {discountPercent}%
              </span>
            </div>
          ) : (
            // Empty placeholder box to prevent card height jumping
            <div className="h-[22px] mt-2.5"></div>
          )}

          {/* Sale Price */}
          <span className="text-[#ff7410] font-bold text-[16px] mt-0.5 text-left">
            {formatPrice(product.salePrice)}
          </span>

          {/* Shop name */}
          {product.shopName && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate mt-2.5">
              <Store size={11} className="shrink-0 text-gray-300" />
              <span className="truncate text-left">{product.shopName}</span>
            </span>
          )}

          {/* Rating and Sold */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {product.rating != null && (
              <div className="flex items-center gap-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
              </div>
            )}
            {product.reviews != null && (
              <span className="text-gray-400 text-xs">({product.reviews})</span>
            )}
            {product.sold != null && product.sold > 0 && (
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
