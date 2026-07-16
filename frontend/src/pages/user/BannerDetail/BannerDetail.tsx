import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Sparkles, AlertCircle } from 'lucide-react'
import { useBanner } from '@/hooks/banner/useBanners'
import dayjs from 'dayjs'
import AppBreadcrumb from '@/components/AppBreadcrumb'

export default function BannerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: banner, isLoading, error } = useBanner(id || '')

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        
        {/* Banner Hero Skeleton */}
        <div className="w-full h-80 sm:h-96 bg-gray-100 rounded-3xl animate-pulse mb-8" />
        
        {/* Title Skeleton */}
        <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-6 w-1/2 bg-gray-100 rounded animate-pulse mb-8" />
        
        {/* Content Skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !banner) {
    return (
      <div className="w-full max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin chiến dịch</h2>
        <p className="text-gray-500 text-sm mb-6">
          Chiến dịch hoặc banner này không tồn tại hoặc đã hết thời gian hiển thị.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Về trang chủ</span>
        </button>
      </div>
    )
  }

  const isExpired = banner.endDate ? dayjs().isAfter(dayjs(banner.endDate)) : false
  const hasDates = banner.startDate || banner.endDate

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Breadcrumb */}
      <AppBreadcrumb
        className="mb-6"
        items={[
          { label: 'Chi tiết chiến dịch' },
          { label: banner.title }
        ]}
      />

      {/* Hero Banner Section */}
      <div className="group relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100/50 mb-8 bg-slate-50">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {/* Campaign Status Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isExpired ? (
            <span className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Đã kết thúc
            </span>
          ) : (
            <span className="bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles size={12} className="animate-pulse" />
              Đang diễn ra
            </span>
          )}

        </div>
      </div>

      {/* Main Campaign Info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
        {/* Newspaper Meta info */}
        {(banner.author || banner.categoryName) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 border-b border-gray-100 pb-4 mb-6">
            {banner.author && (
              <span><strong>Tác giả:</strong> {banner.author}</span>
            )}
            {banner.author && banner.categoryName && <span>•</span>}
            {banner.categoryName && (
              <span className="inline-flex items-center gap-1">
                <strong>Chuyên mục:</strong> 
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold text-[11px]">{banner.categoryName}</span>
              </span>
            )}
            <span>•</span>
            <span><strong>Cập nhật:</strong> {dayjs(banner.createdAt).format('DD/MM/YYYY')}</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
          {banner.title}
        </h1>

        {/* Calendar details */}
        {hasDates && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 pb-2">
            <Calendar size={16} className="text-gray-400" />
            <span>Thời gian chiến dịch:</span>
            <span className="font-semibold text-gray-700">
              {banner.startDate ? dayjs(banner.startDate).format('DD/MM/YYYY') : '---'}
            </span>
            <span>-</span>
            <span className="font-semibold text-gray-700">
              {banner.endDate ? dayjs(banner.endDate).format('DD/MM/YYYY') : 'Vô thời hạn'}
            </span>
          </div>
        )}

        {/* Sapo / Intro / Short Description */}
        {(banner.sapo || banner.shortDescription) && (
          <div className="bg-emerald-50/50 border-l-4 border-primary p-4 rounded-r-2xl mb-6">
            <p className="text-sm sm:text-base text-emerald-900 font-semibold leading-relaxed">
              {banner.sapo || banner.shortDescription}
            </p>
          </div>
        )}

        {/* Structured Body Sections */}
        {banner.contentSections && banner.contentSections.length > 0 ? (
          <div className="space-y-6">
            {banner.contentSections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                {section.title && (
                  <h3 className="text-lg font-bold text-gray-900 mt-4">{section.title}</h3>
                )}
                {section.content && (
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : banner.content ? (
          /* Fallback for raw HTML Content */
          <div className="prose max-w-none text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
            <div dangerouslySetInnerHTML={{ __html: banner.content }} />
          </div>
        ) : (
          <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến với chương trình đặc sắc tại PixelMart! Chiến dịch này mang lại các giải
              pháp và sản phẩm chất lượng cao cùng mức giá ưu đãi tốt nhất cho quý khách hàng. Bấm vào nút
              bên dưới để khám phá ngay bộ sưu tập.
            </p>
          </div>
        )}

        {/* Highlights List */}
        {banner.highlights && banner.highlights.length > 0 && (
          <div className="bg-emerald-50/30 border border-emerald-100/55 p-5 rounded-2xl my-6">
            {banner.highlightsTitle && (
              <h4 className="text-sm sm:text-base font-bold text-emerald-800 mb-3">
                {banner.highlightsTitle}
              </h4>
            )}
            <ul className="list-disc pl-5 space-y-2 text-emerald-900 text-sm sm:text-base">
              {banner.highlights.map((point, idx) => (
                <li key={idx} className="leading-relaxed">{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quote Block */}
        {banner.quote && (
          <div className="border-l-4 border-slate-300 pl-4 py-1 my-6 italic text-gray-600 text-sm sm:text-base bg-slate-50/50 pr-4 rounded-r-lg">
            <p className="leading-relaxed">"{banner.quote}"</p>
            {banner.quoteAuthor && (
              <span className="text-xs text-gray-400 block mt-1 font-medium">— {banner.quoteAuthor}</span>
            )}
          </div>
        )}


      </div>

      {/* Back to Homepage */}
      <div className="flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-semibold group"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  )
}
