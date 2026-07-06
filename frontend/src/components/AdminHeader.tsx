import { Bell, Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Bell size={20} />
        </button>

        <div className="relative hidden sm:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              A
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              Admin
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Settings
              </a>
              <hr className="my-1" />
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
