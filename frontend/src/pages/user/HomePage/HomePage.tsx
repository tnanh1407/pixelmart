import Banner from "./components/Banner";
import Category from "./components/Category";
import CategorySection from "./components/CategorySection";
import FlashSale from "./components/FlashSale";
import OCOPProducts from "./components/OCOPProducts";
import TopSelling from "./components/TopSelling";


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
