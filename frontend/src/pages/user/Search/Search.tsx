import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Filter, Star, RefreshCw, ChevronDown } from 'lucide-react'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import ProductCard from '@/components/common/ProductCard'
import AppBreadcrumb from '@/components/common/AppBreadcrumb'

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  // Filter States
  const [categoryId, setCategoryId] = useState<string>('')
  const [minPriceInput, setMinPriceInput] = useState<string>('')
  const [maxPriceInput, setMaxPriceInput] = useState<string>('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [rating, setRating] = useState<number | undefined>(undefined)
  
  // Sorting State
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Sync categoryId from URL query param if present (e.g. when coming from home page category links)
  const urlCategoryId = searchParams.get('category')
  useEffect(() => {
    if (urlCategoryId) {
      setCategoryId(urlCategoryId)
    }
  }, [urlCategoryId])

  // Fetch all categories for sidebar filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 10 * 60 * 1000,
  })

  // Query products from backend based on filters
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['search-products', query, categoryId, minPrice, maxPrice, sortBy, currentPage],
    queryFn: () => {
      const params: any = {
        page: currentPage,
        limit: 12,
        search: query.trim() || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
      }

      // Map sorting tabs to backend sort values
      if (sortBy === 'newest') params.sort = 'createdAt' // default descending
      else if (sortBy === 'sold') params.sort = 'sold'
      else if (sortBy === 'priceAsc') params.sort = 'priceAsc'
      else if (sortBy === 'priceDesc') params.sort = 'priceDesc'
      else if (sortBy === 'rating') params.sort = 'rating'

      return productService.getProducts(params)
    },
    staleTime: 2 * 60 * 1000,
  })

  const rawProducts = productsResponse?.products || []
  
  // Client-side rating filter
  const products = rating 
    ? rawProducts.filter(p => p.ratingsAverage >= rating)
    : rawProducts

  const pagination = productsResponse?.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    const min = minPriceInput ? Number(minPriceInput) : undefined
    const max = maxPriceInput ? Number(maxPriceInput) : undefined
    setMinPrice(min)
    setMaxPrice(max)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setCategoryId('')
    setMinPriceInput('')
    maxPriceInput && setMaxPriceInput('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setRating(undefined)
    setSortBy('relevance')
    setCurrentPage(1)
    
    // Clear URL category param if present
    if (searchParams.has('category')) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('category')
      setSearchParams(nextParams)
    }
  }

  return (
    <div className="w-full max-w-350 mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <AppBreadcrumb
        className="mb-6"
        items={[{ label: query ? `Tìm kiếm: "${query}"` : 'Tất cả sản phẩm' }]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Filters */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Filter size={18} className="text-primary" />
              <span>BỘ LỌC TÌM KIẾM</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer border-none bg-transparent"
            >
              <RefreshCw size={12} />
              Xóa bộ lọc
            </button>
          </div>

          {/* Section 1: By Category */}
          <div className="mb-6">
            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">Theo Danh Mục</h4>
            <div className="space-y-2">
              <button
                onClick={() => { setCategoryId(''); setCurrentPage(1); }}
                className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
                  !categoryId ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả danh mục
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => { setCategoryId(cat._id); setCurrentPage(1); }}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
                    categoryId === cat._id ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Price Range */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">Khoảng Giá</h4>
            <form onSubmit={handleApplyPrice} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từđ"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full text-center text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Đếnđ"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full text-center text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer border-none"
              >
                ÁP DỤNG
              </button>
            </form>
          </div>

          {/* Section 3: Ratings */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">Đánh Giá</h4>
            <div className="space-y-2">
              {[5, 4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => { setRating(stars); setCurrentPage(1); }}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2 ${
                    rating === stars ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                      />
                    ))}
                  </div>
                  <span>{stars === 5 ? '5 sao' : `từ ${stars} sao`}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Section: Products Listing */}
        <main className="flex-1 min-w-0">
          {/* Top Sort Bar */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-sm text-gray-500 font-medium">Sắp xếp theo</span>
              <button
                onClick={() => setSortBy('relevance')}
                className={`px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors border-none ${
                  sortBy === 'relevance' ? 'bg-primary text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Liên quan
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors border-none ${
                  sortBy === 'newest' ? 'bg-primary text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('sold')}
                className={`px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors border-none ${
                  sortBy === 'sold' ? 'bg-primary text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Bán chạy
              </button>
            </div>

            {/* Price Dropdown Sort */}
            <div className="relative group">
              <button className="px-5 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
                <span>
                  {sortBy === 'priceAsc'
                    ? 'Giá: Thấp đến Cao'
                    : sortBy === 'priceDesc'
                    ? 'Giá: Cao đến Thấp'
                    : 'Giá'}
                </span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 py-1 z-10 hidden group-hover:block">
                <button
                  onClick={() => setSortBy('priceAsc')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors border-none bg-transparent cursor-pointer"
                >
                  Giá: Thấp đến Cao
                </button>
                <button
                  onClick={() => setSortBy('priceDesc')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors border-none bg-transparent cursor-pointer"
                >
                  Giá: Cao đến Thấp
                </button>
              </div>
            </div>
          </div>

          {/* Search Result Label */}
          {query && (
            <div className="text-gray-600 text-sm mb-4">
              Kết quả tìm kiếm cho từ khóa '<span className="font-bold text-gray-900">{query}</span>'
            </div>
          )}

          {/* Grid View */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-xl" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-semibold text-sm flex items-center justify-center cursor-pointer transition-colors border-none ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm mt-10">
              <div className="w-16 h-16 bg-green-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500 text-sm">
                Hãy thử lại bằng cách thay đổi bộ lọc hoặc sử dụng từ khóa tìm kiếm khác.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
