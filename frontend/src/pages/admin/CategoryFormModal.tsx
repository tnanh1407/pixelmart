import { X, Loader2, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface CategoryFormModalProps {
  showModal: boolean
  editingId: string | null
  form: { name: string; description: string; image: string }
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; image: string }>>
  isUploading: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  closeModal: () => void
  isPending: boolean
}

export default function CategoryFormModal({
  showModal, editingId, form, setForm, isUploading, handleFileChange, handleSubmit, closeModal, isPending,
}: CategoryFormModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-text">
            {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Tên danh mục *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nhập tên danh mục" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Hình ảnh danh mục</label>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="URL ảnh hoặc tải ảnh lên" />
                  <label className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
                    isUploading ? 'border-gray-300 bg-gray-50 text-text-muted cursor-not-allowed' : 'border-primary/30 hover:border-primary hover:bg-primary/5 text-primary'
                  }`}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>Tải ảnh lên</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="hidden" />
                  </label>
                </div>
                {form.image && (
                  <div className="relative aspect-video w-full max-w-[200px] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                    <img src={form.image} alt="Category Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, image: '' })}
                      className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Mô tả</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Nhập mô tả (tùy chọn)" />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white mx-0 mb-0 rounded-none border-x-0">
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
