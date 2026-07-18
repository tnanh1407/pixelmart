import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useState, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'

import ProductCard from '@/components/common/ProductCard'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/user/product.service'

const CountdownTimer = () => {
  const [time, setTime] = useState({ hours: 2, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Calculate time remaining until next 3-hour flash sale block (e.g. 12:00, 15:00, 18:00...)
    const updateTime = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const nextHour = currentHour + (3 - (currentHour % 3))
      const target = new Date(now)
      target.setHours(nextHour, 0, 0, 0)
      
      const diff = target.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTime({ hours, minutes, seconds })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const TimeBlock = ({ value }: { value: number }) => (
    <div className="w-9 h-9 bg-[#292929] text-white font-bold text-sm rounded flex items-center justify-center shadow-xs">
      {String(value).padStart(2, '0')}
    </div>
  )

  return (
    <div className="flex items-center gap-1.5 ml-4 md:ml-6">
      <TimeBlock value={time.hours} />
      <span className="text-white font-bold">:</span>
      <TimeBlock value={time.minutes} />
      <span className="text-white font-bold">:</span>
      <TimeBlock value={time.seconds} />
    </div>
  )
}

export default function FlashSale() {
  const flashSaleSwiperRef = useRef<any>(null)

  // Query real active flash sale products from the database
  const { data: flashSaleResponse, isLoading } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: () => productService.getProducts({ flashSaleActive: true, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  })
  const products = flashSaleResponse?.products || []

  if (isLoading) {
    return (
      <section className="w-full max-w-350 mx-auto mt-10 px-4 animate-pulse">
        <div className="bg-[#de0000]/80 rounded-t-2xl px-6 py-4 h-16" />
        <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl p-6 h-80" />
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="w-full max-w-350 mx-auto mt-10 px-4">
      {/* Header */}
      <div className="bg-[#de0000] rounded-t-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center flex-wrap gap-4">
          {/* Logo FlashSale */}
          <div className="flex items-center gap-1.5 text-white font-extrabold italic text-2xl tracking-tight select-none">
            <Zap size={24} className="text-white fill-white rotate-6" />
            <span>FlashSale</span>
          </div>

          {/* Countdown */}
          <CountdownTimer />
        </div>

        {/* Link */}
        <Link
          to="/products?flashSaleActive=true"
          className="flex items-center gap-0.5 text-white hover:underline text-sm font-medium transition-colors cursor-pointer"
        >
          <span>Xem thêm sản phẩm</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Products Slider */}
      <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl p-6 shadow-xs">
        <div className="relative">
          {/* Custom navigation buttons */}
          <button
            onClick={() => flashSaleSwiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => flashSaleSwiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <ChevronRight size={18} />
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
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
