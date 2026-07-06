import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react'

const stats = [
  { name: 'Total Users', value: '1,234', icon: Users, change: '+12%', color: 'bg-blue-500' },
  { name: 'Revenue', value: '$45,678', icon: DollarSign, change: '+8%', color: 'bg-green-500' },
  { name: 'Growth', value: '23%', icon: TrendingUp, change: '+5%', color: 'bg-purple-500' },
  { name: 'Active', value: '89%', icon: Activity, change: '+3%', color: 'bg-orange-500' },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: 'John Doe', action: 'Created a new project', time: '2 minutes ago' },
            { user: 'Jane Smith', action: 'Updated profile settings', time: '15 minutes ago' },
            { user: 'Bob Wilson', action: 'Completed task #123', time: '1 hour ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {item.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.user}</p>
                  <p className="text-sm text-gray-500">{item.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
