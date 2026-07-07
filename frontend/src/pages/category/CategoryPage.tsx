import { ChevronRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import { categoryProducts } from '../../data/products'

export default function CategoryPage() {
  const { slug: _slug } = useParams()
  const categoryName = 'Thực phẩm và đặc sản'

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src="/homeLayout/homePage/category/banner_danhmuc.png"
          alt={categoryName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-2 border-2 border-[#009b4d] text-[#009b4d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#009b4d] hover:text-white transition-colors duration-200">
              Xem thêm sản phẩm
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
