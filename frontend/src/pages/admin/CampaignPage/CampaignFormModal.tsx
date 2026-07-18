import { useState, useCallback } from 'react'
import { X, Loader2, Upload, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminService } from '@/services/admin/admin.service'
import type { ICampaign } from '@/types/campaign.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

// ── Types ──────────────────────────────────────────────
export interface CampaignForm {
  title: string
  shortDescription: string
  image: string
  isActive: boolean
  startDate: string
  endDate: string
  order: number
  content: string
  durationInDays: string
  author: string
  categoryName: string
  sapo: string
  highlightsTitle: string
  highlights: string
  quote: string
  quoteAuthor: string
  contentSections: Array<{ title?: string; content?: string }>
}

const initialForm: CampaignForm = {
  title: '',
  shortDescription: '',
  image: '',
  isActive: true,
  startDate: '',
  endDate: '',
  order: 0,
  content: '',
  durationInDays: '',
  author: '',
  categoryName: '',
  sapo: '',
  highlightsTitle: '',
  highlights: '',
  quote: '',
  quoteAuthor: '',
  contentSections: [],
}

// ── Hook ───────────────────────────────────────────────
export function useCampaignForm() {
  const [form, setForm] = useState<CampaignForm>(initialForm)
  const [activeTab, setActiveTab] = useState<'basic' | 'cms' | 'sections'>('basic')
  const [isUploading, setIsUploading] = useState(false)

  const resetForm = useCallback(() => {
    setForm(initialForm)
    setActiveTab('basic')
  }, [])

  const populateForm = useCallback((campaign: ICampaign) => {
    setForm({
      title: campaign.title || '',
      shortDescription: campaign.shortDescription || '',
      image: campaign.image || '',
      isActive: campaign.isActive ?? true,
      startDate: campaign.startDate ? campaign.startDate.substring(0, 10) : '',
      endDate: campaign.endDate ? campaign.endDate.substring(0, 10) : '',
      order: campaign.order || 0,
      content: campaign.content || '',
      durationInDays: campaign.durationInDays || '',
      author: campaign.author || '',
      categoryName: campaign.categoryName || '',
      sapo: campaign.sapo || '',
      highlightsTitle: campaign.highlightsTitle || '',
      highlights: campaign.highlights ? campaign.highlights.join('\n') : '',
      quote: campaign.quote || '',
      quoteAuthor: campaign.quoteAuthor || '',
      contentSections: campaign.contentSections || [],
    })
    setActiveTab('basic')
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadCampaignImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }, [])

  const buildPayload = useCallback(() => ({
    ...form,
    highlights: form.highlights
      ? form.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
      : [],
  }), [form])

  return { form, setForm, activeTab, setActiveTab, isUploading, resetForm, populateForm, handleFileChange, buildPayload }
}

// ── Tab: Basic ─────────────────────────────────────────
function BasicTab({ form, setForm, isUploading, handleFileChange }: {
  form: CampaignForm
  setForm: React.Dispatch<React.SetStateAction<CampaignForm>>
  isUploading: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Tiêu đề *</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nhập tiêu đề chiến dịch" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Mô tả ngắn</label>
        <textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Mô tả ngắn hiển thị trên chiến dịch (tùy chọn)" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Hình ảnh chiến dịch *</label>
        <div className="space-y-2">
          <div className="flex gap-3">
            <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập URL ảnh hoặc tải ảnh lên" required />
            <label className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${isUploading ? 'border-gray-300 bg-gray-50 text-text-muted cursor-not-allowed' : 'border-primary/30 hover:border-primary hover:bg-primary/5 text-primary'
              }`}>
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span>Tải ảnh lên</span>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="hidden" />
            </label>
          </div>
          {form.image && (
            <div className="relative aspect-21/9 h-[160px] w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img src={form.image} alt="Banner Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setForm({ ...form, image: '' })}
                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Trạng thái hiển thị</label>
        <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
          style={{ backgroundColor: form.isActive ? 'var(--color-primary)' : '#d1d5db' }}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className="ml-2 text-sm text-text-muted">{form.isActive ? 'Đang hiển thị' : 'Đã ẩn'}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Ngày bắt đầu</label>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            disabled={!!form.durationInDays}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-muted disabled:cursor-not-allowed" />
          {!!form.durationInDays && <p className="text-[10px] text-text-muted mt-0.5">Vô hiệu hóa do đã nhập số ngày hiển thị</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Ngày kết thúc</label>
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            disabled={!!form.durationInDays}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-muted disabled:cursor-not-allowed" />
          {!!form.durationInDays && <p className="text-[10px] text-text-muted mt-0.5">Vô hiệu hóa do đã nhập số ngày hiển thị</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Thứ tự hiển thị</label>
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Thời gian hiển thị (số ngày)</label>
          <input type="text" value={form.durationInDays} onChange={(e) => setForm({ ...form, durationInDays: e.target.value })}
            disabled={!!form.startDate || !!form.endDate}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-muted disabled:cursor-not-allowed"
            placeholder="Ví dụ: 30" />
          {(!!form.startDate || !!form.endDate) && <p className="text-[10px] text-text-muted mt-0.5">Vô hiệu hóa do đã nhập ngày bắt đầu/kết thúc</p>}
        </div>
      </div>
    </div>
  )
}

// ── Tab: CMS ───────────────────────────────────────────
function CmsTab({ form, setForm }: { form: CampaignForm; setForm: React.Dispatch<React.SetStateAction<CampaignForm>> }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Sapo (Tóm tắt chiến dịch)</label>
        <textarea value={form.sapo} onChange={(e) => setForm({ ...form, sapo: e.target.value })} rows={5}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-text-muted"
          placeholder="Mô tả tóm tắt nổi bật cho trang chi tiết..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Tác giả biên soạn</label>
          <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-muted"
            placeholder="Ban Biên Tập PixelMart..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Chuyên mục</label>
          <input type="text" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nông Nghiệp Xanh..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Câu trích dẫn (Quote)</label>
        <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={5}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Nhập câu trích dẫn..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Tác giả trích dẫn</label>
        <textarea value={form.quoteAuthor} onChange={(e) => setForm({ ...form, quoteAuthor: e.target.value })} rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Tác giả hoặc chức danh..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Tiêu đề phần nổi bật (Highlights Title)</label>
        <input type="text" value={form.highlightsTitle} onChange={(e) => setForm({ ...form, highlightsTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ví dụ: Quy trình 3 KHÔNG được áp dụng tuyệt đối:" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Danh sách điểm nổi bật (Highlights - Mỗi dòng là một điểm)</label>
        <textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={"Không chín ép bằng hóa chất công nghiệp.\nKhông dư lượng thuốc trừ sâu..."} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Nội dung chi tiết (HTML Content / Fallback)</label>
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nhập nội dung HTML chi tiết nếu không dùng các Phần nội dung..." />
      </div>
    </div>
  )
}

// ── Tab: Sections ──────────────────────────────────────
function SectionsTab({ contentSections, setContentSections }: {
  contentSections: CampaignForm['contentSections']
  setContentSections: (sections: CampaignForm['contentSections']) => void
}) {
  const addSection = () => setContentSections([...contentSections, { title: '', content: '' }])
  const removeSection = (index: number) => setContentSections(contentSections.filter((_, i) => i !== index))
  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const next = [...contentSections]
    next[index] = { ...next[index], [field]: value }
    setContentSections(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">Các phần nội dung hiển thị theo thứ tự từ trên xuống.</p>
        <button type="button" onClick={addSection}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors capitalize cursor-pointer">
          <Plus size={14} /> Thêm phần
        </button>
      </div>
      {contentSections.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
          <p className="text-sm text-text-muted mb-2">Chưa có phần nội dung chi tiết nào.</p>
          <button type="button" onClick={addSection} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Tạo phần nội dung đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
          {contentSections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 space-y-3 relative group">
              <button type="button" onClick={() => removeSection(index)}
                className="absolute top-3 right-3 p-1.5 text-text-muted hover:text-destructive hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-colors shadow-sm" title="Xóa phần này">
                <Trash2 size={14} />
              </button>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Phần #{index + 1}</div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Tiêu đề phần</label>
                <input type="text" value={section.title ?? ''} onChange={(e) => updateSection(index, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tiêu đề phụ..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Nội dung phần</label>
                <textarea value={section.content ?? ''} onChange={(e) => updateSection(index, 'content', e.target.value)} rows={5}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nội dung chi tiết..." />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────
interface CampaignFormModalProps {
  showModal: boolean
  editingId: string | null
  form: CampaignForm
  setForm: React.Dispatch<React.SetStateAction<CampaignForm>>
  activeTab: 'basic' | 'cms' | 'sections'
  setActiveTab: (tab: 'basic' | 'cms' | 'sections') => void
  isUploading: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  closeModal: () => void
  isPending: boolean
}

export default function CampaignFormModal({
  showModal, editingId, form, setForm, activeTab, setActiveTab,
  isUploading, handleFileChange, handleSubmit, closeModal, isPending,
}: CampaignFormModalProps) {
  const tabs = [
    { key: 'basic' as const, label: 'Thông tin cơ bản' },
    { key: 'cms' as const, label: 'Bài viết CMS' },
    { key: 'sections' as const, label: `Phần nội dung (${form.contentSections.length})` },
  ]

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold text-text">
            {editingId ? 'Chỉnh sửa chiến dịch' : 'Thêm chiến dịch mới'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
          {tabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-4 flex-1">
            {activeTab === 'basic' && <BasicTab form={form} setForm={setForm} isUploading={isUploading} handleFileChange={handleFileChange} />}
            {activeTab === 'cms' && <CmsTab form={form} setForm={setForm} />}
            {activeTab === 'sections' && (
              <SectionsTab contentSections={form.contentSections} setContentSections={(sections) => setForm({ ...form, contentSections: sections })} />
            )}
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white mx-0 mb-0 rounded-none border-x-0 ">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              Hủy
            </button>
            <button type="submit" disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
