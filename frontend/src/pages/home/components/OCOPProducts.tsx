import { Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ocopProducts = [
  {
    id: 11,
    name: 'Bánh Phiale Đậu Xanh Sầu Riêng - Tân Huê Viên',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 80000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 12,
    name: 'Bánh Phiale Đậu Xanh Sầu Riêng - Tấn Huê Viên',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 80000,
    discount: 0,
    rating: 5,
    reviews: 3,
  },
  {
    id: 13,
    name: 'Bánh Phiale Khoai Môn Sầu Riêng - Tấn Huê Viên',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: 102000,
    salePrice: 96000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 14,
    name: 'OCOP - Mắm Tép Chưng Thịt PTK - Gói 200g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 91000,
    discount: 0,
    rating: 5,
    reviews: 1,
  },
  {
    id: 15,
    name: 'OCOP - Mật Ong Hoa Nhãn Danh Vi - Chai Nhựa 1L',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 230000,
    discount: 0,
    rating: 5,
    reviews: 19,
  },
  {
    id: 16,
    name: 'OCOP - Tinh Bột Nghệ Turmeric Hoàng Minh Châu -...',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: 330000,
    salePrice: 265903,
    discount: 33,
    rating: 5,
    reviews: 9,
  },
  {
    id: 17,
    name: 'Mật Ong Hoa Sú Vẹt Danh Vi - Chai Nhựa 1L',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 200000,
    discount: 0,
    rating: 5,
    reviews: 7,
  },
  {
    id: 18,
    name: 'Bánh Phiale Khoai Môn Sầu Riêng - Tấn Huê Viên',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: 102000,
    salePrice: 96000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 19,
    name: 'OCOP - Mắm Mía miền Xanh Chai 500ml',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: null,
    salePrice: 70000,
    discount: 0,
    rating: 5,
    reviews: 4,
  },
  {
    id: 20,
    name: 'OCOP - Thịt Xá Xíu Mắm Ruốc PTK - Gói 200g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 91000,
    discount: 0,
    rating: 5,
    reviews: 21,
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
    <span className="text-gray-400 text-xs">({reviews})</span>
  </div>
)

export default function OCOPProducts() {
  return (
    <section className="w-full max-w-300 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-[#009b4d] mb-6">Sản phẩm OCOP</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ocopProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block group">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                      Giảm {product.discount}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-[#009b4d] transition-colors">
                    {product.name}
                  </h3>

                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    )}
                    <span className="text-[#009b4d] font-bold text-base">
                      {formatPrice(product.salePrice)}
                    </span>
                  </div>

                  <StarRating rating={product.rating} reviews={product.reviews} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border-2 border-[#009b4d] text-[#009b4d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
          >
            Xem thêm sản phẩm
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
