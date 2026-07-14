export default function StoreSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-10 bg-gray-200 rounded"></div>
              <div className="w-12 h-10 bg-gray-200 rounded"></div>
              <div className="w-24 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 px-5 pb-5 mt-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
