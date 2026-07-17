import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useCampaigns } from '@/hooks/campaign/useCampaigns'

import 'swiper/css'
import 'swiper/css/pagination'
export default function Banner() {
  const { data: banners, isLoading } = useCampaigns()

  const displayBanners = banners && banners.length > 0 ? banners : null

  return (
    <section className="w-full max-w-350 mx-auto mt-4">
      {isLoading ? (
        <div className="w-full h-50 bg-gray-100 rounded-2xl animate-pulse" />
      ) : displayBanners ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="rounded-2xl"
        >
          {displayBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <Link to={`/campaign/${banner._id}`} className="block w-full overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>KHÔNG CÓ DỮ LIỆU </div>
      )}
    </section>
  )
}
