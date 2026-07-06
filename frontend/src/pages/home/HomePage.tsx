import Banner from './components/Banner'
import Category from './components/Category'
import FlashSale from './components/FlashSale'
import TopSelling from './components/TopSelling'
import OCOPProducts from './components/OCOPProducts'
import CategorySection from './components/CategorySection'

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Category />
      <FlashSale />
      <TopSelling />
      <OCOPProducts />
      <CategorySection />
    </div>
  )
}
