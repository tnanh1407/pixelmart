import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp, Edit, Image, Quote,
  Calendar, Hash, User, Layers, Clock, FileText,
} from 'lucide-react'
import { campaignService } from '@/services/user/campaign.service'
import { useAdminCampaignMutations } from '@/hooks/admin/campaigns/useAdminCampaignMutations'
import CampaignFormModal, { useCampaignForm } from './CampaignFormModal'
import { ConfirmDialog, LoadingState, ImagePreview } from '@/components/admin/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusVariantClass } from '@/lib/status-styles'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

function formatDate(date?: string) {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(date?: string) {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

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
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl border shadow-sm">
        <Image size={48} className="text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold">Không tìm thấy chiến dịch</h3>
        <p className="text-muted-foreground mt-1 text-sm">Đã có lỗi xảy ra hoặc chiến dịch không tồn tại.</p>
        <Button variant="default" className="mt-4" onClick={() => navigate('/admin/campaigns')}>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ──────────────────────────── */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/campaigns">Chiến dịch</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-64 truncate">{campaign.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => navigate('/admin/campaigns')}
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">{campaign.title}</h1>
              <Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', campaign.isActive ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground')}>{campaign.isActive ? 'Đang hiển thị' : 'Ẩn'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {campaign._id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={openEdit}>
            <Edit size={16} className="mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* ── Hero Image ──────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="relative w-full" style={{ maxHeight: '420px' }}>
          {campaign.image ? (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              style={{ maxHeight: '420px' }}
              onClick={() => setPreviewImage({ src: campaign.image, alt: campaign.title })}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
              <Image size={48} />
              <span className="ml-3 text-sm">Chưa có ảnh bìa</span>
            </div>
          )}
        </div>
      </Card>

      {/* ── Quick Stats Row ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <QuickStat label="Tác giả" value={campaign.author} icon={User} />
        <QuickStat label="Danh mục" value={campaign.categoryName} icon={Hash} />
        <QuickStat label="Thứ tự" value={`#${campaign.order}`} icon={Layers} />
        <QuickStat
          label="Thời hạn"
          value={campaign.durationInDays ? `${campaign.durationInDays} ngày` : '\u2014'}
          icon={Clock}
        />
        {campaign.startDate || campaign.endDate ? (
          <QuickStat
            label="Thời gian"
            value={`${formatDate(campaign.startDate)} \u2013 ${formatDate(campaign.endDate)}`}
            icon={Calendar}
          />
        ) : null}
      </div>

      {/* ── Content Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main Content ───────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Short Description */}
          {campaign.shortDescription && (
            <SectionCard title="Mô tả">
              <p className="text-base leading-relaxed text-foreground/85">
                {campaign.shortDescription}
              </p>
            </SectionCard>
          )}

          {/* Sapo */}
          {campaign.sapo && (
            <SectionCard title="Lời dẫn">
              <p className="text-base leading-relaxed text-foreground/80 italic border-l-2 border-primary/20 pl-5 py-1">
                {campaign.sapo}
              </p>
            </SectionCard>
          )}

          {/* Quote */}
          {campaign.quote && (
            <SectionCard title="Trích dẫn" icon={Quote}>
              <blockquote className="text-lg italic leading-relaxed text-foreground/85 border-l-3 border-primary pl-5 py-2">
                &ldquo;{campaign.quote}&rdquo;
              </blockquote>
              {campaign.quoteAuthor && (
                <p className="text-sm text-muted-foreground mt-3 text-right font-medium">
                  &mdash; {campaign.quoteAuthor}
                </p>
              )}
            </SectionCard>
          )}

          {/* Highlights */}
          {campaign.highlights && campaign.highlights.length > 0 && (
            <SectionCard title={campaign.highlightsTitle || 'Điểm nổi bật'}>
              <ul className="space-y-3">
                {campaign.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mt-px">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Content Sections (Accordion) */}
          {campaign.contentSections && campaign.contentSections.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold tracking-tight">Nội dung chi tiết</h2>
                <Badge variant="secondary" className="font-normal">{campaign.contentSections.length} phần</Badge>
              </div>
              <div className="space-y-px rounded-xl border overflow-hidden">
                {campaign.contentSections.map((sec, idx) => {
                  const isOpen = expandedSections.has(idx)
                  return (
                    <div key={idx}>
                      <button
                        type="button"
                        onClick={() => toggleSection(idx)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-sm truncate group-hover:text-foreground transition-colors">
                            {sec.title || `Phần ${idx + 1}`}
                          </span>
                        </div>
                        <span className="shrink-0 ml-3 text-muted-foreground">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>
                      {isOpen && sec.content && (
                        <div className="px-5 pb-5 pt-1">
                          <Separator className="mb-4" />
                          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                            {sec.content}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Raw HTML Content */}
          {campaign.content && (
            <SectionCard title="Nội dung HTML" icon={FileText}>
              <div className="rounded-lg bg-muted/50 p-4 text-sm font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-80 overflow-y-auto border">
                {campaign.content}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="ID" value={campaign._id} mono />
              <Separator />
              <DetailRow label="Trạng thái" value={<Badge className={cn('border-none shadow-none text-xs font-semibold px-2.5 py-0.5', campaign.isActive ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground')}>{campaign.isActive ? 'Đang hiển thị' : 'Ẩn'}</Badge>} />
              <Separator />
              <DetailRow label="Tác giả" value={campaign.author || '\u2014'} />
              <Separator />
              <DetailRow label="Danh mục" value={campaign.categoryName || '\u2014'} />
              <Separator />
              <DetailRow label="Thứ tự hiển thị" value={`#${campaign.order}`} />
              <Separator />
              <DetailRow label="Thời hạn" value={campaign.durationInDays ? `${campaign.durationInDays} ngày` : 'Không giới hạn'} />
              {campaign.startDate && (
                <>
                  <Separator />
                  <DetailRow label="Ngày bắt đầu" value={formatDate(campaign.startDate)} />
                </>
              )}
              {campaign.endDate && (
                <>
                  <Separator />
                  <DetailRow label="Ngày kết thúc" value={formatDate(campaign.endDate)} />
                </>
              )}
              <Separator />
              <DetailRow label="Ngày tạo" value={formatDateTime(campaign.createdAt)} />
              <Separator />
              <DetailRow label="Cập nhật lần cuối" value={formatDateTime(campaign.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Modals & Dialogs ───────────────────── */}
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

/* ─── Reusable sub-components ───────────────────────── */

function QuickStat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
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

function SectionCard({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-right break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
        {value || '\u2014'}
      </span>
    </div>
  )
}
