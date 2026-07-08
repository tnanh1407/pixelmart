import { Globe, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#009b4d] text-white selection:bg-white selection:text-[#009b4d]">
      {/* PHẦN TRÊN */}
      <div className="max-w-350 mx-auto px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Cột 1: Logo + Thông tin */}
          <div className="md:col-span-4 space-y-4">
            <img src='/core/logo_web.svg' alt="Logo" className="w-full max-w-50 h-auto object-contain" />
            <div className="text-gray-100 leading-relaxed">
              <p className="font-bold uppercase text-white mb-2">TỔNG CÔNG TY BƯU ĐIỆN VIỆT NAM</p>
              <p className="mb-3">
                Giấy chứng nhận đăng ký doanh nghiệp số: 0102595740
              </p>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>Số 5 Phạm Hùng, Phường Cầu Giấy, TP Hà Nội</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0" />
                  <span className="font-semibold">1900 565 657</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0" />
                  <span>nongsantmdt@vnpost.vn</span>
                </p>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">DANH MỤC</h4>
            <ul className="space-y-2.5 text-gray-100">
              {['Sản phẩm OCOP', 'Thực phẩm bổ dưỡng', 'Sức khỏe và làm đẹp', 'Thực phẩm và Đặc sản', 'Đồ uống'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white hover:underline transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">HỖ TRỢ</h4>
            <ul className="space-y-2.5 text-gray-100">
              {['Quyền và Nghĩa vụ', 'Quy định đóng gói', 'Đăng ký thành viên'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white hover:underline transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Chính sách */}
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">CHÍNH SÁCH</h4>
            <ul className="space-y-2.5 text-gray-100">
              {['Hướng dẫn mua hàng', 'Hướng dẫn bán hàng', 'Chính sách đổi trả', 'Chính sách bảo mật'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white hover:underline transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 5: Tải ứng dụng */}
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-wider text-white mb-4">TẢI ỨNG DỤNG</h4>
            <p className="text-gray-100 mb-3">Quét mã QR để tải ứng dụng</p>
            <div className="flex items-center gap-3">
              {/* QR Code */}
              <div className="p-1.5 bg-white rounded-lg shrink-0">
                <img
                  src="/footer/qr.svg"
                  alt="QR Code"
                  className="w-16 h-16 object-contain"
                />
              </div>
              {/* Nút tải */}
              <div className="flex flex-col gap-2 flex-1">
                <a href="#" className="block hover:opacity-80 transition-opacity duration-200">
                  <img src="/footer/appstore.svg" alt="App Store" className="h-8 w-auto" />
                </a>
                <a href="#" className="block hover:opacity-80 transition-opacity duration-200">
                  <img src="/footer/chplay.svg" alt="Google Play" className="h-8 w-auto" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Đường kẻ ngang */}
      <div className="max-w-350 mx-auto px-6">
        <hr className="border-t border-green-600/50" />
      </div>

      {/* PHẦN DƯỚI */}
      <div className="bg-[#004e27] text-gray-300 py-3">
        <div className="max-w-350 mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>© 2024 buudien.vn. All rights reserved.</span>

          <div className="flex items-center gap-4">
            <span className="text-gray-300">Kết nối:</span>
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" title="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" title="YouTube">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" title="Website">
              <Globe size={14} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
