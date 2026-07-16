interface CmsTabProps {
  form: {
    sapo: string
    author: string
    categoryName: string
    quote: string
    quoteAuthor: string
    highlightsTitle: string
    highlights: string
    content: string
  }
  setForm: React.Dispatch<React.SetStateAction<any>>
}

export default function CmsTab({ form, setForm }: CmsTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sapo (Tóm tắt chiến dịch)</label>
        <textarea
          value={form.sapo}
          onChange={(e) => setForm({ ...form, sapo: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Mô tả tóm tắt nổi bật cho trang chi tiết..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả biên soạn</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ban Biên Tập PixelMart..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên mục</label>
          <input
            type="text"
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nông Nghiệp Xanh..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Câu trích dẫn (Quote)</label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Nhập câu trích dẫn..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả trích dẫn</label>
          <textarea
            value={form.quoteAuthor}
            onChange={(e) => setForm({ ...form, quoteAuthor: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Tác giả hoặc chức danh..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phần nổi bật (Highlights Title)</label>
        <input
          type="text"
          value={form.highlightsTitle}
          onChange={(e) => setForm({ ...form, highlightsTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ví dụ: Quy trình 3 KHÔNG được áp dụng tuyệt đối:"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh sách điểm nổi bật (Highlights - Mỗi dòng là một điểm)
        </label>
        <textarea
          value={form.highlights}
          onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Không chín ép bằng hóa chất công nghiệp.&#10;Không dư lượng thuốc trừ sâu..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết (HTML Content / Fallback)</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Nhập nội dung HTML chi tiết nếu không dùng các Phần nội dung..."
        />
      </div>
    </div>
  )
}
