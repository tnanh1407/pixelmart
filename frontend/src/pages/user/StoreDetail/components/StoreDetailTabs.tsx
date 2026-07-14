import { Store, TrendingUp, Sparkles, Clock, Package } from 'lucide-react'

export type TabKey = 'home' | 'bestseller' | 'featured' | 'new' | 'all'

interface StoreDetailTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Cửa hàng', icon: <Store size={16} /> },
  { key: 'bestseller', label: 'Bán chạy', icon: <TrendingUp size={16} /> },
  { key: 'featured', label: 'Sản phẩm nổi bật', icon: <Sparkles size={16} /> },
  { key: 'new', label: 'Sản phẩm mới', icon: <Clock size={16} /> },
  { key: 'all', label: 'Tất cả hàng hóa', icon: <Package size={16} /> },
]

export default function StoreDetailTabs({ activeTab, onTabChange }: StoreDetailTabsProps) {
  return (
    <div className="mt-6 mx-6">
      <div className="flex items-center border-b border-gray-200 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab.key
              ? 'border-[#009b4d] text-[#009b4d]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
