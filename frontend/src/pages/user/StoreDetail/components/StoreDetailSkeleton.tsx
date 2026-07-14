export default function StoreDetailSkeleton() {
  return (
    <div className="w-full max-w-350 mx-auto animate-pulse">
      {/* Banner */}
      <div className="w-full h-52 bg-gray-200 rounded-b-2xl" />

      {/* Header */}
      <div className="relative mx-6 -mt-16 z-10 p-6 bg-white rounded-2xl shadow-sm">
        <div className="flex items-start gap-10">
          <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="flex gap-3 mt-4">
              <div className="h-10 bg-gray-200 rounded-lg w-28" />
              <div className="h-10 bg-gray-200 rounded-lg w-20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-32" />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 mx-6 flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24" />
        ))}
      </div>

      {/* Products */}
      <div className="mx-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-64" />
        ))}
      </div>
    </div>
  )
}
