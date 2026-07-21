import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, Edit, Image, Quote, Calendar, Layers, Clock, FileText } from 'lucide-react'
import { campaignService } from '@/services/user/campaign.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function LoadingSkeleton() {
  return (
    <div className="space-y-6 min-h-[400px] p-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
}

function formatDate(date?: string) {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(date?: string) {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const { form, setForm, activeTab, setActiveTab, isUploading, populateForm, handleFileChange, buildPayload } = useCampaignForm()

  const { updateMutation } = useAdminCampaignMutations({ detailId: id })

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['admin-campaign-detail', id],
    queryFn: () => campaignService.getCampaignById(id || ''),
    enabled: !!id,
  })

  const openEdit = () => { if (!campaign) return; populateForm(campaign); setShowModal(true) }
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!form.title.trim()) return; setShowConfirm(true) }
  const toggleSection = (index: number) => setExpandedSections((prev) => {
    const next = new Set(prev); next.has(index) ? next.delete(index) : next.add(index); return next
  })

  if (isLoading) return <LoadingSkeleton />

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl border shadow-sm">
        <Image size={48} className="text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold">Không tìm thấy chiến dịch</h3>
        <p className="text-muted-foreground mt-1 text-sm">Đã có lỗi hoặc chiến dịch không tồn tại.</p>
        <Button variant="default" className="mt-4" onClick={() => navigate('/admin/campaigns')}>Quay lại danh sách</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigate('/admin/campaigns')}>
            <ArrowLeft size={18} />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">{campaign.title}</h1>
              <Badge className={cn('text-xs font-semibold px-2.5 py-0.5', campaign.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground')}>
                {campaign.isActive ? 'Đang hiển thị' : 'Ẩn'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-mono">{campaign._id}</p>
          </div>
        </div>
        <Button onClick={openEdit} className="shrink-0"><Edit size={16} className="mr-2" />Chỉnh sửa</Button>
      </div>

      {/* Hero Image */}
      <Card className="overflow-hidden">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="w-full max-h-[420px] object-cover cursor-pointer hover:opacity-95"
            onClick={() => setPreviewImage({ src: campaign.image, alt: campaign.title })} />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground gap-3">
            <Image size={48} /><span className="text-sm">Chưa có ảnh bìa</span>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <QuickStat label="Thứ tự" value={`#${campaign.order}`} icon={Layers} />
        <QuickStat label="Thời hạn" value={campaign.durationInDays ? `${campaign.durationInDays} ngày` : '\u2014'} icon={Clock} />
        {(campaign.startDate || campaign.endDate) && (
          <QuickStat label="Thời gian" value={`${formatDate(campaign.startDate)} \u2013 ${formatDate(campaign.endDate)}`} icon={Calendar} />
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {campaign.shortDescription && <SectionCard title="Mô tả"><p className="leading-relaxed">{campaign.shortDescription}</p></SectionCard>}
          {campaign.sapo && <SectionCard title="Lời dẫn"><p className="italic border-l-2 border-primary/20 pl-5">{campaign.sapo}</p></SectionCard>}
          {campaign.quote && (
            <SectionCard title="Trích dẫn" icon={Quote}>
              <blockquote className="text-lg italic border-l-3 border-primary pl-5">&ldquo;{campaign.quote}&rdquo;</blockquote>
              {campaign.quoteAuthor && <p className="text-sm text-muted-foreground mt-3 text-right">&mdash; {campaign.quoteAuthor}</p>}
            </SectionCard>
          )}
          {campaign.highlights && campaign.highlights.length > 0 && (
            <SectionCard title={campaign.highlightsTitle || 'Điểm nổi bật'}>
              <ul className="space-y-3">
                {campaign.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{i + 1}</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
          {campaign.contentSections && campaign.contentSections.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">Nội dung chi tiết</h2>
                <Badge variant="secondary">{campaign.contentSections.length} phần</Badge>
              </div>
              <div className="rounded-xl border overflow-hidden">
                {campaign.contentSections.map((sec: any, idx: number) => {
                  const isOpen = expandedSections.has(idx)
                  return (
                    <div key={idx}>
                      <button onClick={() => toggleSection(idx)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">{idx + 1}</span>
                          <span className="font-medium text-sm truncate">{sec.title || `Phần ${idx + 1}`}</span>
                        </div>
                        {isOpen ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                      </button>
                      {isOpen && sec.content && (
                        <div className="px-5 pb-5 pt-1">
                          <Separator className="mb-4" />
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {campaign.content && (
            <SectionCard title="Nội dung HTML" icon={FileText}>
              <div className="rounded-lg bg-muted/50 p-4 text-sm font-mono max-h-80 overflow-y-auto border">{campaign.content}</div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="ID" value={campaign._id} mono />
              <Separator />
              <DetailRow label="Trạng thái" value={<Badge className={cn('text-xs font-semibold px-2.5 py-0.5', campaign.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground')}>{campaign.isActive ? 'Đang hiển thị' : 'Ẩn'}</Badge>} />
              <Separator />
              <DetailRow label="Tác giả" value={campaign.author || '\u2014'} />
              <Separator />
              <DetailRow label="Thứ tự" value={`#${campaign.order}`} />
              <Separator />
              <DetailRow label="Thời hạn" value={campaign.durationInDays ? `${campaign.durationInDays} ngày` : 'Không giới hạn'} />
              {campaign.startDate && <><Separator /><DetailRow label="Ngày bắt đầu" value={formatDate(campaign.startDate)} /></>}
              {campaign.endDate && <><Separator /><DetailRow label="Ngày kết thúc" value={formatDate(campaign.endDate)} /></>}
              <Separator />
              <DetailRow label="Ngày tạo" value={formatDateTime(campaign.createdAt)} />
              <Separator />
              <DetailRow label="Cập nhật" value={formatDateTime(campaign.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CampaignFormModal
        showModal={showModal} editingId={id || null} form={form} setForm={setForm}
        activeTab={activeTab} setActiveTab={setActiveTab} isUploading={isUploading}
        handleFileChange={handleFileChange} handleSubmit={handleSubmit}
        closeModal={() => setShowModal(false)} isPending={updateMutation.isPending} />

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận cập nhật?</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn lưu các thay đổi cho chiến dịch này?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Hủy</Button>
            <Button onClick={() => updateMutation.mutate({ id: id || '', payload: buildPayload() }, {
              onSuccess: () => { setShowModal(false); setShowConfirm(false) }
            })}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          {previewImage && <img src={previewImage.src} alt={previewImage.alt} className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QuickStat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon size={18} className="text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium mt-0.5 truncate">{value || '\u2014'}</p>
        </div>
      </div>
    </Card>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Card><CardContent className="p-6">{children}</CardContent></Card>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-right break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value || '\u2014'}</span>
    </div>
  )
}
