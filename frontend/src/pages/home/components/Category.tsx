import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'

const categories = [
  { id: 1, name: 'Đồ uống', image: '/homeLayout/homePage/category/category (ocop).png', color: 'bg-sky-300', link: '/products?category=drinks' },
  { id: 2, name: 'Sức khỏe và làm đẹp', image: null, color: 'bg-pink-300', link: '/products?category=health' },
  { id: 3, name: 'Tất cả sản phẩm', image: null, color: 'bg-emerald-300', link: '/products' },
  { id: 4, name: 'Sản phẩm Ocop', image: '/homeLayout/homePage/category/category (ocop).png', color: 'bg-yellow-300', link: '/products?category=ocop' },
  { id: 5, name: 'Thực phẩm và đặc sản', image: null, color: 'bg-orange-300', link: '/products?category=food' },
  { id: 6, name: 'Nông sản tươi', image: null, color: 'bg-lime-300', link: '/products?category=fresh' },
  { id: 7, name: 'Gạo & Ngũ cốc', image: null, color: 'bg-teal-300', link: '/products?category=grain' },
  { id: 8, name: 'Trái cây', image: null, color: 'bg-rose-300', link: '/products?category=fruit' },
  { id: 9, name: 'Rau củ quả', image: null, color: 'bg-green-300', link: '/products?category=vegetable' },
  { id: 10, name: 'Hải sản', image: null, color: 'bg-cyan-300', link: '/products?category=seafood' },
]

export default function Category() {
  const swiperRef = useRef<any>(null)

  return (
    <section className="w-full max-w-300 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-[#009b4d] mb-6">Danh mục</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border-2 border-[#009b4d] rounded-full flex items-center justify-center text-[#009b4d] shadow-md hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border-2 border-[#009b4d] rounded-full flex items-center justify-center text-[#009b4d] shadow-md hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
          >
            <ChevronRight size={20} />
          </button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="pb-2 px-2"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link to={cat.link} className="block group/cat">
                  <div className={`relative h-35 rounded-xl overflow-hidden ${cat.color} shadow-md hover:shadow-xl transition-all duration-300`}>
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent"></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <h3 className="text-white font-bold text-[15px] leading-tight max-w-25 drop-shadow-md">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
