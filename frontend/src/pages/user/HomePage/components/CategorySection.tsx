import { Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const categoryProducts = [
  {
    id: 21,
    name: 'OCOP - Chấm Chèo Lục Lệ - Hộp 250g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 40000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 22,
    name: 'OCOP - Miến Dong Hưng Phúc - Đặc sản Điện Biên -...',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 80000,
    discount: 0,
    rating: 5,
    reviews: 26,
  },
  {
    id: 23,
    name: 'Dưa Lưới Ninh Thuận',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: null,
    salePrice: 289000,
    discount: 0,
    rating: 5,
    reviews: 1,
  },
  {
    id: 24,
    name: 'Bột Sắn Dây Miền Bắc 3 Sạch - Gói 500g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 77000,
    discount: 0,
    rating: 5,
    reviews: 28,
  },
  {
    id: 25,
    name: 'OCOP - Táo Sấy Dẻo Tách Hạt Thái Thuận - Túi 418g',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 96000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 26,
    name: 'Thịt Trâu Hun Khói 3 Sạch - Túi 500g',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: null,
    salePrice: 455000,
    discount: 0,
    rating: 5,
    reviews: 2,
  },
  {
    id: 27,
    name: 'Thịt Ba Chỉ Hun Khói 3 Sạch - Túi 500g',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: null,
    salePrice: 190000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 28,
    name: 'OCOP - Miến Gia Huy Ngọc Cương - Túi 500g',
    image: '/homeLayout/homePage/banner/banner_2.webp',
    originalPrice: null,
    salePrice: 90000,
    discount: 0,
    rating: 5,
    reviews: 0,
  },
  {
    id: 29,
    name: 'OCOP - Mắm Mía Miền Xanh Chai 500ml',
    image: '/homeLayout/homePage/banner/banner_3.webp',
    originalPrice: null,
    salePrice: 70000,
    discount: 0,
    rating: 5,
    reviews: 4,
  },
  {
    id: 30,
    name: 'Gạo Nếp Pi Pất Cao Bằng 3 Sạch',
    image: '/homeLayout/homePage/banner/banner_1.webp',
    originalPrice: 115000,
    salePrice: 65000,
    discount: 10,
    rating: 5,
    reviews: 0,
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

export default function CategorySection() {
  return (
    <section className="w-full mt-10">
      {/* Banner Header - Full Width */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <img
          src="/homeLayout/homePage/category/banner_danhmuc.png"
          alt="Thực phẩm và đặc sản"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg  ml-[600px]">
            Thực phẩm và đặc sản
          </h2>
        </div>
      </div>

      {/* Products Grid - Max Width 1400px */}
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
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
                        -{product.discount}%
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
              to="/category/thuc-pham-va-dac-san"
              className="inline-flex items-center gap-2 border-2 border-[#009b4d] text-[#009b4d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
            >
              Xem thêm sản phẩm
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
