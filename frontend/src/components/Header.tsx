import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const categories = [
  'Hạnh nhân Vinh Châu',
  'Mật ong',
  'Mỹ chữ Bắc Giang',
  'Đông trùng hạ thảo',
  'Gạo Séng Cù',
]

const searchOptions = [
  { value: 'product', label: 'Hàng hóa' },
  { value: 'store', label: 'Cửa hàng' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchType, setSearchType] = useState(searchOptions[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      {/* Top bar - Green */}
      <div className="bg-[#009b4d] text-white text-base py-2">
        <div className="max-w-350 mx-auto flex items-center justify-between h-9">
          <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">
            Kênh bán hàng
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">Tiếng Việt</Link>
            <Link to="/" className="transition-colors duration-300 hover:text-secondary font-medium">Thông báo</Link>
            <Link to="/store-list" className="transition-colors duration-300 hover:text-secondary font-medium">Gian hàng</Link>
            <Link to="/pointmall-voucher" className="transition-colors duration-300 hover:text-secondary font-medium">Mã giảm giá</Link>
          </div>
        </div>
      </div>

      {/* Main header - White */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-350 mx-auto py-3">
          {/* Row 1: Logo + Search + Actions */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center gap-2">
              <img src="/core/logo_web.svg" alt="Nông sản Bưu điện" className="h-14 w-auto object-contain" />
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl hidden md:flex flex-col">
              <div className="flex items-center w-full border-2 border-gray-200 rounded-lg focus-within:border-primary transition-colors shadow-sm hover:shadow-md">
                {/* Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="cursor-pointer  flex items-center gap-1.5 h-full px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded-l-lg"
                  >
                    <span>{searchType.label}</span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 w-44 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 py-1 z-50">
                      {searchOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSearchType(option)
                            setDropdownOpen(false)
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${searchType.value === option.value ? 'text-primary font-semibold bg-green-50' : 'text-gray-700'
                            }`}
                        >
                          <span>{option.label}</span>
                          {searchType.value === option.value && (
                            <svg className="w-4 h-4 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, cửa hàng..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />

                {/* Search button */}
                <button className="px-5 py-2.5 bg-primary text-white hover:bg-primary-hover transition-colors rounded-r-lg">
                  <Search size={20} />
                </button>
              </div>

              {/* Category links - dưới search */}
              <div className="flex items-center gap-4 mt-2.5 text-sm text-gray-500 capitalize font-medium">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to="/"
                    className={`whitespace-nowrap hover:text-primary transition-colors ${cat === 'Đông trùng hạ thảo' ? 'text-primary font-semibold' : ''
                      }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-5 shrink-0">
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors">
                <User size={20} />
                <span className="text-base font-medium hidden sm:inline">Đăng nhập</span>
              </Link>
              <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors">
                <ShoppingCart size={20} />
                <span className="text-base font-medium hidden sm:inline">Giỏ hàng</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-3 py-2 text-base outline-none"
          />
          <button className="px-3 py-2 bg-[#009b4d] text-white cursor-pointer">
            <Search size={16} />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 overflow-x-auto">
          {categories.map((cat) => (
            <Link key={cat} to="/" className="whitespace-nowrap hover:text-[#009b4d] transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Đăng nhập
            </Link>
            <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Đăng ký
            </Link>
            <Link to="/cart" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Giỏ hàng
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
