import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../../../../components/ProductCard'
import { categoryProducts } from '../../../../data/products'

export default function CategorySection() {
  return (
    <section className="w-full mt-10">
      <div className="relative w-full h-[180px] overflow-hidden">
        <img
          src="/homeLayout/homePage/category/banner_danhmuc.png"
          alt="Thực phẩm và đặc sản"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg  ml-[600px]">
            Thực phẩm và đặc sản
          </h2>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/category/thuc-pham-va-dac-san"
              className="inline-flex items-center gap-2 border-2 border-[#009b4d] text-[#009b4d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
            >
              Xem thêm sản phẩm
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
