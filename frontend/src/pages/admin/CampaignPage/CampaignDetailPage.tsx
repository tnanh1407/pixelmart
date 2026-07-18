import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ArrowLeft, FileText, Image, Layers, Loader2, Edit, Calendar, User, Tag, Clock, Quote, ChevronDown, ChevronUp } from 'lucide-react'
import { campaignService } from '@/services/campaign.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import ImagePreviewDialog from '@/components/ui/image-preview-dialog'
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

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const payloadRef = useRef<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const {
    form, setForm, activeTab, setActiveTab,
    isUploading, populateForm, handleFileChange, buildPayload,
  } = useCampaignForm()

  const { updateMutation } = useAdminCampaignMutations({ detailId: id })

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['admin-campaign-detail', id],
    queryFn: () => campaignService.getCampaignById(id || ''),
    enabled: !!id,
  })

  const openEdit = () => {
    if (!campaign) return
    populateForm(campaign)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    payloadRef.current = buildPayload()
    setShowConfirmDialog(true)
  }

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Image size={48} className="mx-auto text-text-muted mb-3" />
        <h3 className="text-lg font-semibold text-text">Không tìm thấy chiến dịch</h3>
        <p className="text-text-muted mt-1">Đã có lỗi xảy ra hoặc chiến dịch không tồn tại.</p>
        <button
          onClick={() => navigate('/admin/campaigns')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{campaign.title}</h1>
              <Badge
                variant={campaign.isActive ? 'default' : 'destructive'}
                className={`px-3 py-1 text-xs font-semibold shadow-none border-none ${
                  campaign.isActive ? 'bg-green-500/10 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {campaign.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
              </Badge>
            </div>
            <p className="text-sm text-text-muted mt-1">ID: {campaign._id}</p>
          </div>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm"
        >
          <Edit size={16} />
          Chỉnh sửa
        </button>
      </div>

      {/* Banner Image */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="aspect-21/9 h-75 w-full bg-gray-100">
          {campaign.image ? (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setPreviewImage({ src: campaign.image, alt: campaign.title })}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <Image size={48} />
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Short Description */}
          {campaign.shortDescription && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Mô tả ngắn</h2>
              <p className="text-base text-text leading-relaxed">{campaign.shortDescription}</p>
            </div>
          )}

          {/* Quote */}
          {campaign.quote && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Trích dẫn</h2>
              </div>
              <blockquote className="text-lg italic text-text border-l-4 border-primary pl-4 py-2">
                "{campaign.quote}"
              </blockquote>
              {campaign.quoteAuthor && (
                <cite className="block text-sm font-medium text-text-muted mt-3 text-right">
                  — {campaign.quoteAuthor}
                </cite>
              )}
            </div>
          )}

          {/* Highlights */}
          {campaign.highlights && campaign.highlights.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Điểm nổi bật</h2>
              <ul className="space-y-3">
                {campaign.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-text leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Sections */}
          {campaign.contentSections && campaign.contentSections.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Nội dung chi tiết ({campaign.contentSections.length} phần)
                </h2>
              </div>
              <div className="space-y-3">
                {campaign.contentSections.map((sec, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-text">{sec.title || `Phần ${idx + 1}`}</span>
                      </div>
                      {expandedSections.has(idx) ? (
                        <ChevronUp size={18} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={18} className="text-text-muted" />
                      )}
                    </button>
                    {expandedSections.has(idx) && sec.content && (
                      <div className="p-4 border-t border-gray-100">
                        <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed">{sec.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Content */}
          {campaign.content && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Nội dung HTML</h2>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm font-mono text-text-muted whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                {campaign.content}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Tag size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Thứ tự hiển thị</p>
                  <p className="text-sm font-semibold text-text">#{campaign.order}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Tác giả</p>
                  <p className="text-sm font-medium text-text">{campaign.author || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Tag size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Danh mục</p>
                  <p className="text-sm font-medium text-text">{campaign.categoryName || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Thời gian hiển thị</h2>
            </div>
            <div className="space-y-3">
              {campaign.startDate || campaign.endDate ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-xs text-text-muted">Từ ngày</p>
                      <p className="text-sm font-medium text-text">
                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div>
                      <p className="text-xs text-text-muted">Đến ngày</p>
                      <p className="text-sm font-medium text-text">
                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-text-muted">Thời hạn</p>
                    <p className="text-sm font-semibold text-primary">
                      {campaign.durationInDays || 'Không giới hạn'} ngày
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sapo Card */}
          {campaign.sapo && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Sapo (Lời dẫn)</h2>
              <p className="text-sm text-text italic leading-relaxed">{campaign.sapo}</p>
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
              Bạn có chắc chắn muốn lưu các thay đổi cho chiến dịch này?
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

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        src={previewImage?.src}
        alt={previewImage?.alt}
      />
    </div>
  )
}
