import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useState, useEffect } from 'react'
import api from '@/services/client'
import 'swiper/css'
import 'swiper/css/navigation'

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string | null;
  parentId?: string | null;
}

const getCategoryImageUrl = (slug: string, dbImage: string | null | undefined) => {
  if (dbImage) return dbImage;
  
  switch (slug) {
    case 'san-pham-ocop':
      return 'https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png';
    case 'thuc-pham-bo-duong':
      return 'https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png';
    case 'suc-khoe-va-lam-dep':
      return 'https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png';
    case 'thuc-pham-va-dac-san':
      return 'https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png';
    case 'do-uong':
      return 'https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png';
    default:
      return 'https://nongsan.buudien.vn/static/buudien/images/category%20(1).png';
  }
}

export default function Category() {
  const swiperRef = useRef<any>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        if (response.data?.success) {
          const rootCategories = response.data.data.filter((cat: CategoryItem) => !cat.parentId)
          setCategories(rootCategories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="w-full max-w-350 mx-auto mt-10 px-4">
        <h2 className="text-xl font-bold text-[#009b4d] mb-6">Danh mục</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[221/131] w-full bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="w-full max-w-350 mx-auto mt-10 px-4">
      {/* Title with nav */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#009b4d]">Danh mục</h2>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-all duration-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-all duration-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
        }}
        className="pb-2"
      >
        {categories.map((cat) => {
          const link = `/products?category=${cat.slug}`
          return (
            <SwiperSlide key={cat._id}>
              <Link to={link} className="block overflow-hidden rounded-xl group shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-[221/131] w-full overflow-hidden bg-gray-50">
                  <img
                    src={getCategoryImageUrl(cat.slug, cat.image)}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay background gradient to make white text popped */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  <div className="absolute left-4 bottom-4 right-4 z-10">
                    <h3 className="text-white font-bold text-[14px] md:text-[15px] leading-tight text-left max-w-[70%] drop-shadow-md capitalize">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
