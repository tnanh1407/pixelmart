import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '@/hooks/user/store/useStore'
import { useProducts } from '@/hooks/user/product/useProducts'
import StoreDetailBanner from './components/StoreDetailBanner'
import StoreDetailHeader from './components/StoreDetailHeader'
import StoreDetailTabs, { type TabKey } from './components/StoreDetailTabs'
import StoreDetailHomeTab from './components/StoreDetailHomeTab'
import StoreDetailProductsTab from './components/StoreDetailProductsTab'
import StoreDetailSkeleton from './components/StoreDetailSkeleton'

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabKey>('home')

  const { data: store, isLoading: loadingStore } = useStore(id)
  const { data: productsData, isLoading: loadingProducts } = useProducts({ storeId: id, limit: 50 })
  const products = productsData?.products || []

  if (loadingStore) return <StoreDetailSkeleton />
  if (!store) return <div className="text-center py-20 text-gray-500">Không tìm thấy cửa hàng</div>

  const bestSellers = products
    .filter((p) => p.ratingsQuantity > 100)
    .sort((a, b) => b.ratingsQuantity - a.ratingsQuantity)
  const featured = products.filter((p) => p.isFeatured)
  const newProducts = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="w-full max-w-350 mx-auto">
      <StoreDetailBanner store={store} />
      <StoreDetailHeader store={store} productsCount={products.length} />
      <StoreDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mx-6 py-6">
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <StoreDetailHomeTab
                store={store}
                products={products}
                onShowAll={() => setActiveTab('all')}
              />
            )}
            {activeTab === 'bestseller' && (
              <StoreDetailProductsTab type="bestseller" products={bestSellers} totalCount={bestSellers.length} />
            )}
            {activeTab === 'featured' && (
              <StoreDetailProductsTab type="featured" products={featured} totalCount={featured.length} />
            )}
            {activeTab === 'new' && (
              <StoreDetailProductsTab type="new" products={newProducts.slice(0, 10)} totalCount={newProducts.length} />
            )}
            {activeTab === 'all' && (
              <StoreDetailProductsTab type="all" products={products} totalCount={products.length} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
