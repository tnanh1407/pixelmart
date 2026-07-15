import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, Trash2, Eye, EyeOff, Star, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminService.getProducts({ page, limit: 10, search: search || undefined }),
    staleTime: 30 * 1000,
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => {
      const product = data?.products.find((p) => p._id === id)
      return adminService.updateProduct(id, { isActive: !product?.isActive })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => {
      const product = data?.products.find((p) => p._id === id)
      return adminService.updateProduct(id, { isFeatured: !product?.isFeatured })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Xóa sản phẩm thành công')
    },
    onError: () => toast.error('Không thể xóa sản phẩm'),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const products = data?.products || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} sản phẩm</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Sản phẩm</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Giá</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Kho</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Đánh giá</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {product.discountPrice ? (
                            <>
                              <p className="text-sm font-medium text-red-600">{formatPrice(product.discountPrice)}</p>
                              <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                            </>
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${product.stock <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm text-gray-700">{product.ratingsAverage?.toFixed(1) || '0.0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive ? 'Đang bán' : 'Ẩn'}
                          </span>
                          {product.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Nổi bật
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActiveMutation.mutate(product._id)}
                            disabled={toggleActiveMutation.isPending}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={product.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                          >
                            {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => toggleFeaturedMutation.mutate(product._id)}
                            disabled={toggleFeaturedMutation.isPending}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.isFeatured ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={product.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                          >
                            <Star size={16} className={product.isFeatured ? 'fill-amber-500' : ''} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                                deleteMutation.mutate(product._id)
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Trang {pagination.page} / {pagination.totalPages}
                </p>
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
