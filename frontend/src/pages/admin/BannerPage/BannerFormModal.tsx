import { X, Loader2 } from 'lucide-react'
import BasicTab from './BasicTab'
import CmsTab from './CmsTab'
import SectionsTab from './SectionsTab'

interface BannerForm {
  title: string
  shortDescription: string
  image: string
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
  contentSections: Array<{ title: string; content: string }>
}

interface BannerFormModalProps {
  showModal: boolean
  editingId: string | null
  form: BannerForm
  setForm: React.Dispatch<React.SetStateAction<BannerForm>>
  activeTab: 'basic' | 'cms' | 'sections'
  setActiveTab: (tab: 'basic' | 'cms' | 'sections') => void
  isUploading: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  closeModal: () => void
  isPending: boolean
}

export default function BannerFormModal({
  showModal,
  editingId,
  form,
  setForm,
  activeTab,
  setActiveTab,
  isUploading,
  handleFileChange,
  handleSubmit,
  closeModal,
  isPending,
}: BannerFormModalProps) {
  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
          </h3>
          <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin cơ bản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'cms'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bài viết CMS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'sections'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Phần nội dung ({form.contentSections.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-4 flex-1">
            {activeTab === 'basic' && (
              <BasicTab
                form={form}
                setForm={setForm}
                isUploading={isUploading}
                handleFileChange={handleFileChange}
              />
            )}

            {activeTab === 'cms' && (
              <CmsTab form={form} setForm={setForm} />
            )}

            {activeTab === 'sections' && (
              <SectionsTab
                contentSections={form.contentSections}
                setContentSections={(sections) => setForm({ ...form, contentSections: sections })}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
