import { X, Upload, Loader2 } from 'lucide-react'

interface BasicTabProps {
  form: {
    title: string
    shortDescription: string
    image: string
    startDate: string
    endDate: string
    order: number
    durationInDays: string
  }
  setForm: React.Dispatch<React.SetStateAction<any>>
  isUploading: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function BasicTab({ form, setForm, isUploading, handleFileChange }: BasicTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Nhập tiêu đề banner"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
        <textarea
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Mô tả ngắn hiển thị trên banner (tùy chọn)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh banner *</label>
        <div className="space-y-2">
          <div className="flex gap-3">
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập URL ảnh hoặc tải ảnh lên"
              required
            />
            <label className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
              isUploading
                ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-600'
            }`}>
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              <span>Tải ảnh lên</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
          {form.image && (
            <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img src={form.image} alt="Banner Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, image: '' })}
                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            disabled={!!form.durationInDays}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
          {!!form.durationInDays && (
            <p className="text-[10px] text-gray-400 mt-0.5">Vô hiệu hóa do đã nhập số ngày hiển thị</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            disabled={!!form.durationInDays}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
          {!!form.durationInDays && (
            <p className="text-[10px] text-gray-400 mt-0.5">Vô hiệu hóa do đã nhập số ngày hiển thị</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian hiển thị (số ngày)</label>
          <input
            type="text"
            value={form.durationInDays}
            onChange={(e) => setForm({ ...form, durationInDays: e.target.value })}
            disabled={!!form.startDate || !!form.endDate}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            placeholder="Ví dụ: 30"
          />
          {(!!form.startDate || !!form.endDate) && (
            <p className="text-[10px] text-gray-400 mt-0.5">Vô hiệu hóa do đã nhập ngày bắt đầu/kết thúc</p>
          )}
        </div>
      </div>
    </div>
  )
}
