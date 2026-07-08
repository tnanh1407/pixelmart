import { Link } from 'react-router-dom'

export default function AuthHeader() {
  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      {/* Top bar - Green */}
      <div className="bg-primary text-white text-base py-2 ">
        <div className="max-w-350 mx-auto  flex items-center justify-between h-9">
          <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">
            Kênh bán hàng
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">Tiếng Việt</Link>
            <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">Thông Báo</Link>
            <Link to="/store-list" className="transition-colors duration-300 hover:text-secondary font-medium">Gian hàng</Link>
            <Link to="/pointmall-voucher" className="transition-colors duration-300 hover:text-secondary font-medium">Mã giảm giá</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar - White with Logo */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-350 mx-auto  flex items-center h-20">
          <Link to="/">
            <img src="/core/logo_web_bg.svg" alt="Nông sản An Việt" className="h-14 w-auto object-contain" />
          </Link>
        </div>
      </div>
    </header>
  )
}
