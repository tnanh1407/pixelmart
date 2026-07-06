import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <aside
      className={clsx(
        'bg-gray-900 text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && (
          <span className="text-xl font-bold text-indigo-400">Admin</span>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-700 rounded hidden lg:block"
        >
          <ChevronLeft
            size={20}
            className={clsx('transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-700">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
