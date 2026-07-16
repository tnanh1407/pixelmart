import { Plus, Trash2 } from 'lucide-react'

interface ContentSection {
  title: string
  content: string
}

interface SectionsTabProps {
  contentSections: ContentSection[]
  setContentSections: (sections: ContentSection[]) => void
}

export default function SectionsTab({ contentSections, setContentSections }: SectionsTabProps) {
  const addSection = () => {
    setContentSections([...contentSections, { title: '', content: '' }])
  }

  const removeSection = (index: number) => {
    const newSections = [...contentSections]
    newSections.splice(index, 1)
    setContentSections(newSections)
  }

  const updateSection = (index: number, field: keyof ContentSection, value: string) => {
    const newSections = [...contentSections]
    newSections[index][field] = value
    setContentSections(newSections)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Các phần nội dung hiển thị theo thứ tự từ trên xuống.</p>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Thêm phần
        </button>
      </div>

      {contentSections.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-400 mb-2">Chưa có phần nội dung chi tiết nào.</p>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            Tạo phần nội dung đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
          {contentSections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 space-y-3 relative group">
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-colors shadow-sm"
                title="Xóa phần này"
              >
                <Trash2 size={14} />
              </button>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Phần #{index + 1}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề phần</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tiêu đề phụ..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nội dung phần</label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nội dung chi tiết..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
