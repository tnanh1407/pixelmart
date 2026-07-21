import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useCampaigns } from '@/hooks/user/campaign/useCampaigns'

import 'swiper/css'
import 'swiper/css/pagination'
export default function CampaignSlider() {
  const { data: campaigns, isLoading } = useCampaigns()

  const displayCampaigns = campaigns && campaigns.length > 0 ? campaigns : null

  return (
    <section className="w-full max-w-350 mx-auto mt-4">
      {isLoading ? (
        <div className="w-full h-50 bg-gray-100 rounded-2xl animate-pulse" />
      ) : displayCampaigns ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="rounded-2xl"
        >
          {displayCampaigns.map((campaign) => (
            <SwiperSlide key={campaign._id}>
              <Link to={`/campaign/${campaign._id}`} className="block w-full overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>KHÔNG CÓ DỮ LIỆU 2</div>
      )}
    </section>
  )
}
