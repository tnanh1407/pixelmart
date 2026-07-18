import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ArrowLeft, FileText, Image, Layers, Loader2, Edit, Calendar, User, Tag, Clock, Quote, ChevronDown, ChevronUp } from 'lucide-react'
import { campaignService } from '@/services/campaign.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import { StatusBadge, StatusToggle, ConfirmDialog, LoadingState, DetailCard, DetailInfoRow, ImagePreview } from '@/components/admin/shared'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const payloadRef = useRef<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const { form, setForm, activeTab, setActiveTab, isUploading, populateForm, handleFileChange, buildPayload } = useCampaignForm()

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
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  if (isLoading) return <LoadingState className="min-h-[400px]" />

  if (error || !campaign) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Image size={48} className="mx-auto text-text-muted mb-3" />
        <h3 className="text-lg font-semibold text-text">Không tìm thấy chiến dịch</h3>
        <p className="text-text-muted mt-1">Đã có lỗi xảy ra hoặc chiến dịch không tồn tại.</p>
        <button onClick={() => navigate('/admin/campaigns')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/campaigns')}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">{campaign.title}</h1>
              <StatusBadge active={campaign.isActive} activeLabel="Đang hiển thị" />
            </div>
            <p className="text-sm text-text-muted mt-1">ID: {campaign._id}</p>
          </div>
        </div>
        <button onClick={openEdit}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm">
          <Edit size={16} />
          Chỉnh sửa
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="aspect-21/9 h-75 w-full bg-gray-100">
          {campaign.image ? (
            <img src={campaign.image} alt={campaign.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setPreviewImage({ src: campaign.image, alt: campaign.title })} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <Image size={48} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {campaign.shortDescription && (
            <DetailCard title="Mô tả ngắn">
              <p className="text-base text-text leading-relaxed">{campaign.shortDescription}</p>
            </DetailCard>
          )}

          {campaign.quote && (
            <DetailCard title="Trích dẫn" icon={Quote}>
              <blockquote className="text-lg italic text-text border-l-4 border-primary pl-4 py-2">
                &ldquo;{campaign.quote}&rdquo;
              </blockquote>
              {campaign.quoteAuthor && (
                <cite className="block text-sm font-medium text-text-muted mt-3 text-right">
                  \u2014 {campaign.quoteAuthor}
                </cite>
              )}
            </DetailCard>
          )}

          {campaign.highlights && campaign.highlights.length > 0 && (
            <DetailCard title="Điểm nổi bật">
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
            </DetailCard>
          )}

          {campaign.contentSections && campaign.contentSections.length > 0 && (
            <DetailCard title={`Nội dung chi tiết (${campaign.contentSections.length} phần)`} icon={Layers}>
              <div className="space-y-3">
                {campaign.contentSections.map((sec, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-text">{sec.title || `Phần ${idx + 1}`}</span>
                      </div>
                      {expandedSections.has(idx) ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
                    </button>
                    {expandedSections.has(idx) && sec.content && (
                      <div className="p-4 border-t border-gray-100">
                        <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed">{sec.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DetailCard>
          )}

          {campaign.content && (
            <DetailCard title="Nội dung HTML" icon={FileText}>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm font-mono text-text-muted whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                {campaign.content}
              </div>
            </DetailCard>
          )}
        </div>

        <div className="space-y-6">
          <DetailCard title="Thông tin cơ bản" icon={Tag}>
            <div className="space-y-4">
              <DetailInfoRow icon={Tag} label="Thứ tự hiển thị" value={`#${campaign.order}`} />
              <DetailInfoRow icon={User} label="Tác giả" value={campaign.author || '\u2014'} />
              <DetailInfoRow icon={Tag} label="Danh mục" value={campaign.categoryName || '\u2014'} />
            </div>
          </DetailCard>

          <DetailCard title="Thời gian hiển thị" icon={Calendar}>
            <div className="space-y-3">
              {campaign.startDate || campaign.endDate ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-xs text-text-muted">Từ ngày</p>
                      <p className="text-sm font-medium text-text">
                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('vi-VN') : '\u2014'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div>
                      <p className="text-xs text-text-muted">Đến ngày</p>
                      <p className="text-sm font-medium text-text">
                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('vi-VN') : '\u2014'}
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
          </DetailCard>

          {campaign.sapo && (
            <DetailCard title="Sapo (Lời dẫn)">
              <p className="text-sm text-text italic leading-relaxed">{campaign.sapo}</p>
            </DetailCard>
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

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Xác nhận cập nhật?"
        description="Bạn có chắc chắn muốn lưu các thay đổi cho chiến dịch này?"
        onConfirm={() => {
          updateMutation.mutate({ id: id || '', payload: buildPayload() }, {
            onSuccess: () => { setShowModal(false); setShowConfirmDialog(false); payloadRef.current = null },
          })
        }}
      />

      <ImagePreview
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        src={previewImage?.src}
        alt={previewImage?.alt}
      />
    </div>
  )
}
