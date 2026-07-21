import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Sparkles, Tag, User } from 'lucide-react'
import { useCampaign } from '@/hooks/user/campaign/useCampaigns'
import dayjs from 'dayjs'
import AppBreadcrumb from '@/components/common/AppBreadcrumb'

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: campaign, isLoading } = useCampaign(id || '')

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="w-full aspect-[21/9] bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Không tìm thấy chiến dịch</h2>
        <Link to="/" className="text-primary font-semibold text-sm">Về trang chủ</Link>
      </div>
    )
  }

  const isExpired = campaign.endDate ? dayjs().isAfter(dayjs(campaign.endDate)) : false
  const typeLabel = campaign.type === 'promotion' ? 'Khuyến mãi' : 'Bài viết'
  const authorName = typeof campaign.authorId === 'object' ? campaign.authorId?.name : 'PixelMart'

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <AppBreadcrumb
        className="mb-6"
        items={[
          { label: 'Chiến dịch', to: '/campaigns' },
          { label: campaign.title },
        ]}
      />

      {/* === HERO IMAGE === */}
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-6 bg-slate-50">
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className={isExpired
            ? 'bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full'
            : 'bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1'
          }>
            {isExpired ? 'Đã kết thúc' : <><Sparkles size={12} /> Đang diễn ra</>}
          </span>
          <span className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            <Tag size={12} className="inline mr-1" />{typeLabel}
          </span>
        </div>
      </div>

      {/* === META INFO === */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
        <span className="flex items-center gap-1.5">
          <User size={15} />
          {authorName}
        </span>

        <span className="flex items-center gap-1.5">
          <Calendar size={15} />
          {campaign.startDate ? dayjs(campaign.startDate).format('DD/MM/YYYY') : '---'}
          <span className="mx-1">-</span>
          {campaign.endDate ? dayjs(campaign.endDate).format('DD/MM/YYYY') : 'Vô thời hạn'}
        </span>

        {campaign.durationInDays && (
          <span className="flex items-center gap-1.5">
            <Clock size={15} />
            {campaign.durationInDays} ngày
          </span>
        )}

        <span>{dayjs(campaign.createdAt).format('DD/MM/YYYY HH:mm')}</span>
      </div>

      {/* === TITLE === */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{campaign.title}</h1>

      {/* === SAPO === */}
      {(campaign.sapo || campaign.shortDescription) && (
        <p className="text-gray-600 leading-relaxed mb-6 font-medium">
          {campaign.sapo || campaign.shortDescription}
        </p>
      )}

      {/* === CONTENT === */}
      {campaign.contentSections?.length > 0 ? (
        <div className="space-y-6 mb-8">
          {campaign.contentSections.map((s: any, i: number) => (
            <div key={i}>
              {s.title && <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>}
              {s.content && <p className="text-gray-600 leading-relaxed">{s.content}</p>}
            </div>
          ))}
        </div>
      ) : campaign.content ? (
        <div className="prose max-w-none text-gray-600 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: campaign.content }} />
      ) : null}

      {/* === HIGHLIGHTS === */}
      {campaign.highlights?.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8">
          {campaign.highlightsTitle && (
            <h3 className="font-bold text-emerald-800 mb-3">{campaign.highlightsTitle}</h3>
          )}
          <ul className="space-y-2">
            {campaign.highlights.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-emerald-900 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* === QUOTE === */}
      {campaign.quote && (
        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-8 italic text-gray-500 bg-gray-50 rounded-r-lg">
          <p>"{campaign.quote}"</p>
          {campaign.quoteAuthor && (
            <cite className="text-xs text-gray-400 block mt-1 not-italic">— {campaign.quoteAuthor}</cite>
          )}
        </blockquote>
      )}

      {/* === BACK === */}
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary text-sm font-semibold"
      >
        <ArrowLeft size={16} />
        Danh sách chiến dịch
      </Link>
    </div>
  )
}
