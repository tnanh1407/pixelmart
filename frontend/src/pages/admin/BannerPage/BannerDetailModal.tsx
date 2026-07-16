import { X, Calendar, Info, FileText, Image, Star, Layers, AlignLeft } from 'lucide-react'

interface Banner {
  _id: string
  title: string
  shortDescription?: string
  image?: string
  order: number
  startDate?: string
  endDate?: string
  isActive: boolean
  content?: string
  durationInDays?: string
  author?: string
  categoryName?: string
  sapo?: string
  highlights?: string[]
  quote?: string
  quoteAuthor?: string
  contentSections?: Array<{ title: string; content: string }>
  createdAt?: string
  updatedAt?: string
}

interface BannerDetailModalProps {
  show: boolean
  banner: Banner | null
  onClose: () => void
}

export default function BannerDetailModal({ show, banner, onClose }: BannerDetailModalProps) {
  if (!show || !banner) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Image size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết chiến dịch Banner</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Cover Image */}
          {banner.image ? (
            <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[21/9] w-full rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0">
              <Image size={32} className="mb-2" />
              <span className="text-xs">Không có hình ảnh</span>
            </div>
          )}

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiêu đề Banner</span>
                <p className="text-base font-semibold text-gray-900 mt-0.5">{banner.title}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả ngắn</span>
                <p className="text-sm text-gray-600 mt-0.5">{banner.shortDescription || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Trạng thái</span>
                  <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {banner.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thứ tự ưu tiên</span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">#{banner.order}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thời hạn hiển thị</span>
                <div className="mt-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 space-y-1">
                  {banner.startDate || banner.endDate ? (
                    <>
                      <p>Từ: <span className="font-medium">{banner.startDate ? new Date(banner.startDate).toLocaleDateString('vi-VN') : '—'}</span></p>
                      <p>Đến: <span className="font-medium">{banner.endDate ? new Date(banner.endDate).toLocaleDateString('vi-VN') : '—'}</span></p>
                    </>
                  ) : (
                    <p>Số ngày đặt lịch: <span className="font-semibold text-indigo-600">{banner.durationInDays || 'Không giới hạn'} ngày</span></p>
                  )}
                </div>
              </div>
            </div>

            {/* CMS / Content Info */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Danh mục chiến dịch</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{banner.categoryName || 'N/A'}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tác giả bài viết</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{banner.author || 'N/A'}</p>
              </div>

              {banner.sapo && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sapo (Lời dẫn)</span>
                  <p className="text-xs text-gray-600 mt-0.5 italic">{banner.sapo}</p>
                </div>
              )}

              {banner.highlights && banner.highlights.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Điểm nổi bật</span>
                  <ul className="space-y-1 text-xs text-gray-600 list-disc pl-4">
                    {banner.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quote Block */}
          {banner.quote && (
            <div className="p-4 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-lg">
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Trích dẫn chiến dịch</span>
              <blockquote className="text-sm italic text-gray-700 mt-1">"{banner.quote}"</blockquote>
              {banner.quoteAuthor && (
                <cite className="block text-xs font-medium text-gray-500 mt-1.5">— {banner.quoteAuthor}</cite>
              )}
            </div>
          )}

          {/* CMS Content body */}
          {banner.content && (
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText size={14} />
                Nội dung chi tiết (HTML)
              </span>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 max-h-[150px] overflow-y-auto text-xs font-mono text-gray-600">
                {banner.content}
              </div>
            </div>
          )}

          {/* Sections List */}
          {banner.contentSections && banner.contentSections.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Layers size={14} />
                Các phần nội dung ({banner.contentSections.length})
              </span>
              <div className="space-y-3">
                {banner.contentSections.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                      <span className="w-4 h-4 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px]">{idx + 1}</span>
                      {sec.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 pl-5 whitespace-pre-wrap">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
