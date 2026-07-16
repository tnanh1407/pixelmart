import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import { ocopProducts } from '../../../../data/products'

export default function OCOPProducts() {
  return (
    <section className="w-full max-w-350 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-[#009b4d] mb-6">Sản phẩm OCOP</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ocopProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border-2 border-[#009b4d] text-[#009b4d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#009b4d] hover:text-white transition-colors duration-200"
          >
            Xem thêm sản phẩm
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
