import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useState, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from '../../../../components/ProductCard'
import { flashSaleProducts } from '../../../../data/products'

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
      <div className="bg-white text-red-600 font-bold px-3 py-1.5  text-base min-w-12 text-center shadow-md">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-white text-md mt-1 opacity-80">{label}</span>
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
    <section className="w-full max-w-350 mx-auto mt-10">
       <h2 className="text-2xl font-bold text-primary mb-6 capitalize">Giảm giá mạnh</h2>
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 via-red-500 to-orange-500 rounded-t-2xl px-6 py-5 flex items-center justify-between">
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
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
