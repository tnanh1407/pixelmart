import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react'
import { useBanners } from '@/hooks/banner/useBanners'
import AppBreadcrumb from '@/components/AppBreadcrumb'
import dayjs from 'dayjs'

export default function BannerList() {
  const { data: banners = [], isLoading } = useBanners()

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-6" />

        {/* Title Skeleton */}
        <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mb-8" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden p-4 space-y-4">
              <div className="w-full aspect-video bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Breadcrumb */}
      <AppBreadcrumb
        className="mb-6"
        items={[{ label: 'Danh sách chiến dịch' }]}
      />

      {/* Header Banner Section */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-emerald-600 to-teal-500 py-12 px-8 sm:px-12 text-white shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Sparkles size={300} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles size={12} className="animate-pulse" />
            <span>Chương trình đặc sắc</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Chiến dịch & Khuyến mãi nổi bật
          </h1>
          <p className="text-emerald-50 text-sm sm:text-base font-medium leading-relaxed">
            Tổng hợp các chương trình ưu đãi lớn, kích cầu tiêu dùng đặc sản OCOP và nông nghiệp bền vững. Khám phá các chiến dịch chất lượng quốc gia cùng mức giá tốt nhất tại PixelMart.
          </p>
        </div>
      </div>

      {/* Campaign List Grid */}
      {banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => {
            const isExpired = banner.endDate ? dayjs().isAfter(dayjs(banner.endDate)) : false
            const hasDates = banner.startDate || banner.endDate

            return (
              <div
                key={banner._id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative w-full aspect-video overflow-hidden bg-slate-50">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {isExpired ? (
                      <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        Đã kết thúc
                      </span>
                    ) : (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles size={10} className="animate-pulse" />
                        Đang diễn ra
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Category / Position Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-3 capitalize">
                    <Tag size={12} className="text-primary" />
                    <span>{banner.categoryName || 'Chiến dịch'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                    {banner.title}
                  </h3>

                  {/* Sapo / Short Description */}
                  {(banner.sapo || banner.shortDescription) && (
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                      {banner.sapo || banner.shortDescription}
                    </p>
                  )}

                  {/* Date range footer */}
                  {hasDates && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 pt-3 border-t border-gray-50">
                      <Calendar size={13} />
                      <span>
                        {banner.startDate ? dayjs(banner.startDate).format('DD/MM/YYYY') : '---'}
                      </span>
                      <span>-</span>
                      <span>
                        {banner.endDate ? dayjs(banner.endDate).format('DD/MM/YYYY') : 'Vô thời hạn'}
                      </span>
                    </div>
                  )}

                  {/* Action Link */}
                  <Link
                    to={`/banner/${banner._id}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold text-sm transition-colors mt-auto group/btn cursor-pointer"
                  >
                    <span>Xem chi tiết chiến dịch</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có chiến dịch nào</h2>
          <p className="text-gray-500 text-sm mb-6">
            Hiện tại hệ thống chưa hoạt động chiến dịch khuyến mãi nào. Hãy quay lại sau nhé!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  )
}
