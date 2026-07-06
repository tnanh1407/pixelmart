import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useState, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'

const flashSaleProducts = [
  { id: 1, name: 'Combo thịt gác bếp Cao Lan', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 345000, salePrice: 289000, discount: 15 },
  { id: 2, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 275000, salePrice: 190000, discount: 31 },
  { id: 3, name: 'OCOP - Mật Ong Đông Trùng Hạ Thảo Tam Đào - Hũ 400g', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 380000, salePrice: 250000, discount: 34 },
  { id: 4, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 528000, salePrice: 350000, discount: 34 },
  { id: 5, name: 'OCOP - Hành tím Vĩnh Châu Sóc Trăng - 5kg', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 190000, salePrice: 175000, discount: 8 },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const CountdownTimer = () => {
  const [time, setTime] = useState({ days: 181, hours: 21, minutes: 53, seconds: 39 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white text-red-600 font-bold px-3 py-1.5 rounded-lg text-base min-w-[48px] text-center shadow-md">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-white text-[10px] mt-1 opacity-80">{label}</span>
    </div>
  )

  return (
    <div className="flex items-center gap-2">
      <TimeBlock value={time.days} label="Ngày" />
      <span className="text-white font-bold text-lg">:</span>
      <TimeBlock value={time.hours} label="Giờ" />
      <span className="text-white font-bold text-lg">:</span>
      <TimeBlock value={time.minutes} label="Phút" />
      <span className="text-white font-bold text-lg">:</span>
      <TimeBlock value={time.seconds} label="Giây" />
    </div>
  )
}

export default function FlashSale() {
  const flashSaleSwiperRef = useRef<any>(null)

  return (
    <section className="w-full max-w-300 mx-auto mt-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-t-2xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo FlashSale */}
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <div className="bg-white p-1.5 rounded-lg">
              <Zap size={24} className="text-red-600 fill-red-600" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-wide">FlashSale</span>
          </div>

          {/* Countdown */}
          <CountdownTimer />
        </div>

        {/* Link */}
        <Link
          to="/flash-sale"
          className="flex items-center gap-2 text-white font-medium hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <span>Xem thêm sản phẩm</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Products */}
      <div className="bg-white rounded-b-2xl p-6 shadow-sm">
        <div className="relative">
          <button
            onClick={() => flashSaleSwiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => flashSaleSwiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            <ChevronRight size={20} />
          </button>

          <Swiper
            onSwiper={(swiper) => (flashSaleSwiperRef.current = swiper)}
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
            {flashSaleProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <Link to={`/product/${product.id}`} className="block group">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-[180px] overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <div className="bg-white p-0.5 rounded-full">
                          <Zap size={10} className="text-red-500 fill-red-500" />
                        </div>
                        FlashSale
                      </div>
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        GIẢM {product.discount}%
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="bg-green-100 text-green-700 text-[10px] font-medium px-1.5 py-0.5 rounded">GIẢM {product.discount}%</span>
                      </div>
                      <span className="text-red-500 font-bold text-base">{formatPrice(product.salePrice)}</span>
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
