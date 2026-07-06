import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Leaf } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <section className="w-full flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 480px)' }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-[#009b4d] to-green-400 py-16 px-8 text-center text-white">
          <h1 className="text-[100px] md:text-[140px] font-extrabold leading-none select-none">
            404
          </h1>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col items-center justify-center text-center py-10 px-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center -mt-16 mb-4 border-4 border-white shadow-lg">
            <Leaf size={36} className="text-[#009b4d]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Trang không tồn tại
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Trang bạn tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>

          {/* Các nút hành động */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#009b4d] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#007a3d] transition-colors duration-200"
            >
              <Home size={16} />
              Về trang chủ
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:border-gray-400 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
