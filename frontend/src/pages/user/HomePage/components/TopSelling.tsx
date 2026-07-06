import { Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const topProducts = [
  {
    id: 1,
    name: 'Gạo Séng Cù - Đặc Sản Lào Cai - Túi 5kg',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 175500,
    discount: 0,
    rating: 5,
    reviews: 743,
  },
  {
    id: 2,
    name: 'Khoai Lang Giống Nhật 365 Fresh - Thùng 3kg (Bao Gồm...)',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 168000,
    discount: 0,
    rating: 4,
    reviews: 98,
  },
  {
    id: 3,
    name: 'OCOP - Bánh Sữa Non Ba Vì - Gói 500g',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: 144000,
    salePrice: 82080,
    discount: 20,
    rating: 5,
    reviews: 94,
  },
  {
    id: 4,
    name: 'Mỳ Gạo Chũ Bắc Giang Dương Kiên - Combo 2 Gói 500g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 76000,
    discount: 0,
    rating: 5,
    reviews: 85,
  },
  {
    id: 5,
    name: 'OCOP - Miến Dong Hưng Phúc - Đặc Sản Điện Biên - ...',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 80000,
    discount: 0,
    rating: 5,
    reviews: 70,
  },
  {
    id: 6,
    name: 'OCOP - Thịt Gác Bếp Cao Lan - Gói 200g',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: null,
    salePrice: 139000,
    discount: 0,
    rating: 5,
    reviews: 57,
  },
  {
    id: 7,
    name: 'OCOP - Miến Dong Xuất Khẩu Dương Kiên - Combo 2 Gói...',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 118000,
    discount: 0,
    rating: 5,
    reviews: 56,
  },
  {
    id: 8,
    name: 'Gạo ST25 Ông Cốc - Túi 5kg',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 250000,
    discount: 0,
    rating: 5,
    reviews: 47,
  },
  {
    id: 9,
    name: 'OCOP - Xoài Sấy Dẻo Quỳnh Thanh - Hộp Giấy 200gr',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: 96000,
    salePrice: 48600,
    discount: 20,
    rating: 5,
    reviews: 39,
  },
  {
    id: 10,
    name: 'OCOP - Thịt Gác Bếp Cao Lan - Gói 500g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 159000,
    discount: 0,
    rating: 5,
    reviews: 38,
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

export default function TopSelling() {
  return (
    <section className="w-full max-w-350 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-[#009b4d] mb-6">Top bán chạy</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block group">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-[#009b4d] transition-colors">
                    {product.name}
                  </h3>

                  <div className="mb-2">
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through mr-2">
                        {formatPrice(product.originalPrice)}
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
