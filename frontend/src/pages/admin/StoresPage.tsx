import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2, Store } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'

export default function StoresPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stores', page, search],
    queryFn: () => adminService.getStores({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const toggleVerifiedMutation = useMutation({
    mutationFn: (id: string) => {
      const store = data?.stores.find((s) => s._id === id)
      return adminService.updateStore(id, { isVerified: !store?.isVerified })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => {
      const store = data?.stores.find((s) => s._id === id)
      return adminService.updateStore(id, { isActive: !store?.isActive })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Xóa cửa hàng thành công')
    },
    onError: () => toast.error('Không thể xóa cửa hàng'),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const stores = data?.stores || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa hàng</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} cửa hàng</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cửa hàng..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <Store size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Không tìm thấy cửa hàng nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cửa hàng</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Liên hệ</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Đánh giá</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stores.map((store: any) => (
                    <tr key={store._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {store.logo ? (
                              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Store size={18} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                            <p className="text-xs text-gray-500">{store.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{store.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{store.ratingsAverage?.toFixed(1) || '0.0'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            store.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {store.isActive ? 'Hoạt động' : 'Ẩn'}
                          </span>
                          {store.isVerified && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Đã xác minh
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleVerifiedMutation.mutate(store._id)}
                            disabled={toggleVerifiedMutation.isPending}
                            className={`p-1.5 rounded-lg transition-colors ${
                              store.isVerified ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={store.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => toggleActiveMutation.mutate(store._id)}
                            disabled={toggleActiveMutation.isPending}
                            className={`p-1.5 rounded-lg transition-colors ${
                              store.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={store.isActive ? 'Ẩn cửa hàng' : 'Hiện cửa hàng'}
                          >
                            {store.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa cửa hàng này?')) {
                                deleteMutation.mutate(store._id)
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Trang {pagination.page} / {pagination.totalPages}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
