import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { storeService } from '@/services/store.service'
import { provinces } from '../../../data/products'
import StoreBanner from './components/StoreBanner'
import StoreFilterSidebar from './components/StoreFilterSidebar'
import StoreCard from './components/StoreCard'
import StoreSkeleton from './components/StoreSkeleton'
import StoreEmptyState from './components/StoreEmptyState'
import Pagination from './components/Pagination'

const ITEMS_PER_PAGE = 10

export default function Storelist() {
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('')
  const [shopType, setShopType] = useState<'all' | 'normal' | 'mall'>('all')
  const [category, setCategory] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedProvince, setAppliedProvince] = useState('')
  const [appliedShopType, setAppliedShopType] = useState<'all' | 'normal' | 'mall'>('all')
  const [appliedCategory, setAppliedCategory] = useState<string[]>([])

  const { data: storesResponse, isLoading: loading } = useQuery({
    queryKey: ['stores', appliedSearch, appliedShopType],
    queryFn: async () => {
      const params: any = { limit: 100 }
      if (appliedSearch.trim()) params.search = appliedSearch.trim()
      if (appliedShopType === 'mall') params.isVerified = true
      else if (appliedShopType === 'normal') params.isVerified = false

      return storeService.getStores(params)
    },
  })

  const rawStores = (storesResponse?.stores || []).map((store: any) => {
    const nameHash = store.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    const provinceName = provinces[nameHash % provinces.length]

    const nameLower = store.name.toLowerCase()
    const descLower = (store.description || '').toLowerCase()
    let storeCategory = 'OCOP'
    if (nameLower.includes('ocop') || descLower.includes('ocop')) storeCategory = 'OCOP'
    else if (nameLower.includes('nông sản') || nameLower.includes('thực phẩm') || nameLower.includes('gạo') || nameLower.includes('bưởi')) storeCategory = 'Nông sản và Thực phẩm'
    else if (nameLower.includes('sức khỏe') || nameLower.includes('làm đẹp') || nameLower.includes('trà') || nameLower.includes('mật ong')) storeCategory = 'Sức khỏe và làm đẹp'

    return { ...store, province: provinceName, category: storeCategory, rating: store.ratingsAverage || 5.0 }
  })

  const filteredStores = rawStores.filter((store) => {
    if (appliedProvince && store.province !== appliedProvince) return false
    if (appliedCategory.length > 0 && !appliedCategory.includes(store.category)) return false
    return true
  })

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE)
  const paginatedStores = filteredStores.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleApplyFilters = () => {
    setAppliedSearch(search)
    setAppliedProvince(province)
    setAppliedShopType(shopType)
    setAppliedCategory(category)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setProvince('')
    setShopType('all')
    setCategory([])
    setAppliedSearch('')
    setAppliedProvince('')
    setAppliedShopType('all')
    setAppliedCategory([])
    setCurrentPage(1)
  }

  return (
    <div className="w-full max-w-350 mx-auto">
      <StoreBanner />

      <div className="flex gap-6 py-6">
        <StoreFilterSidebar
          search={search}
          setSearch={setSearch}
          province={province}
          setProvince={setProvince}
          shopType={shopType}
          setShopType={setShopType}
          category={category}
          setCategory={setCategory}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <div className="flex-1">
          {loading ? (
            <StoreSkeleton />
          ) : paginatedStores.length > 0 ? (
            <div className="space-y-6">
              {paginatedStores.map((store) => (
                <StoreCard key={store._id} store={store} />
              ))}
            </div>
          ) : (
            <StoreEmptyState />
          )}
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
