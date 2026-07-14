import { Link } from 'react-router-dom'
import ProductCard from '../../../../components/ProductCard'
import { topSellingProducts as topProducts } from '../../../../data/products'

export default function TopSelling() {
  return (
    <section className="w-full max-w-350 mx-auto mt-10 px-4">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#01633c] mb-5">Top bán chạy</h2>

      {/* Grid containing products directly */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View more button at the bottom */}
      <div className="mt-8 flex justify-center">
        <Link
          to="/products"
          className="inline-flex items-center justify-center border border-[#e9e9e9] bg-white text-gray-700 text-sm px-8 py-2.5 rounded-[10px] font-medium hover:border-[#009b4d] hover:text-[#009b4d] hover:shadow-xs transition-all duration-200 cursor-pointer"
        >
          Xem thêm sản phẩm
        </Link>
      </div>
    </section>
  )
}
