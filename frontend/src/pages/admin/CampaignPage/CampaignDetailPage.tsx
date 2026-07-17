import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ArrowLeft, FileText, Image, Layers, Loader2, Edit } from 'lucide-react'
import { campaignService } from '@/services/campaign.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const payloadRef = useRef<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const {
    form, setForm, activeTab, setActiveTab,
    isUploading, populateForm, handleFileChange, buildPayload,
  } = useCampaignForm()

  const { updateMutation } = useAdminCampaignMutations({ detailId: id })

  const { data: banner, isLoading, error } = useQuery({
    queryKey: ['admin-campaign-detail', id],
    queryFn: () => campaignService.getCampaignById(id || ''),
    enabled: !!id,
  })

  const openEdit = () => {
    if (!banner) return
    populateForm(banner)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    payloadRef.current = buildPayload()
    setShowConfirmDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error || !banner) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Image size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy chiến dịch</h3>
        <p className="text-gray-500 mt-1">Đã có lỗi xảy ra hoặc chiến dịch không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/campaigns')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{banner.title}</h1>
        
          </div>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Edit size={16} />
          Chỉnh sửa chiến dịch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="p-6 space-y-6">
         <div className='grid grid-cols-1 md:grid-col-2 gap-6'>
           <div className="aspect-21/9 h-75 rounded-lg overflow-hidden border border-gray-100 bg-red-500">
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
          </div>
          <div className='bg-red-300'>HELLO</div>
         </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiêu đề chiến dịch</span>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{banner.title}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả ngắn</span>
                <p className="text-sm text-gray-600 mt-0.5">{banner.shortDescription || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Trạng thái</span>
                  <Badge
                    variant={banner.isActive ? 'default' : 'destructive'}
                    className={`mt-1.5 px-3 py-1 text-xs font-semibold shadow-none border-none ${banner.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-700' : ''
                      }`}
                  >
                    {banner.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thứ tự hiển thị</span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">#{banner.order}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thời hạn hiển thị</span>
                <div className="mt-1.5 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 space-y-1">
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

          {banner.quote && (
            <div className="p-4 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-lg">
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Trích dẫn chiến dịch</span>
              <blockquote className="text-sm italic text-gray-700 mt-1">"{banner.quote}"</blockquote>
              {banner.quoteAuthor && (
                <cite className="block text-xs font-medium text-gray-500 mt-1.5">— {banner.quoteAuthor}</cite>
              )}
            </div>
          )}

          {banner.content && (
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText size={14} />
                Nội dung chi tiết (HTML)
              </span>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs font-mono text-gray-600 whitespace-pre-wrap break-all">
                {banner.content}
              </div>
            </div>
          )}

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

      </div>

      <CampaignFormModal
        showModal={showModal}
        editingId={id || null}
        form={form}
        setForm={setForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)}
        isPending={updateMutation.isPending}
      />

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn lưu các thay đổi cho banner này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              updateMutation.mutate({ id: id || '', payload: buildPayload() }, {
                onSuccess: () => {
                  setShowModal(false)
                  setShowConfirmDialog(false)
                  payloadRef.current = null
                },
              })
            }}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
