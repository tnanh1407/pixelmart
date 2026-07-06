import { useState, useEffect } from 'react'
import { ArrowUp, Phone, MessageCircle, X } from 'lucide-react'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showFab, setShowFab] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!showFab) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {/* Menu items */}
      {isOpen && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Phone */}
          <a
            href="tel:1900565657"
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
              <Phone size={18} className="text-white" />
            </div>
          </a>

          {/* Messenger */}
          <a
            href="#"
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.907 1.452 5.504 3.727 7.217V22l3.435-1.885c.921.255 1.89.393 2.838.393 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.075 12.467l-2.546-2.727-4.975 2.727 5.475-5.818 2.596 2.727 4.925-2.727-5.475 5.818z"/>
              </svg>
            </div>
          </a>

          {/* Zalo */}
          <a
            href="#"
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Zalo</span>
            </div>
          </a>

          {/* Hotline */}
          <a
            href="tel:1900565657"
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
              <Phone size={18} className="text-white" />
            </div>
          </a>

          {/* SMS */}
          <a
            href="sms:1900565657"
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
          </a>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-orange-400' : 'bg-[#009b4d]'
        }`}
      >
        {isOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <span className="w-5 h-0.5 bg-white rounded-full"></span>
            <span className="w-5 h-0.5 bg-white rounded-full"></span>
            <span className="w-5 h-0.5 bg-white rounded-full"></span>
          </div>
        )}
      </button>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-white border-2 border-[#009b4d] rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
      >
        <ArrowUp size={20} className="text-[#009b4d]" />
      </button>
    </div>
  )
}
