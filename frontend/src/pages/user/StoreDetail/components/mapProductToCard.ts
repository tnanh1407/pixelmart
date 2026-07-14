import type { IProduct } from '@/types/product.types'

export function mapProductToCard(product: IProduct) {
  return {
    id: product._id,
    name: product.name,
    image: product.images?.[0] || '',
    originalPrice: product.price,
    salePrice: product.discountPrice || product.price,
    discount: product.discountPrice
      ? Math.round((1 - product.discountPrice / product.price) * 100)
      : 0,
    rating: product.ratingsAverage,
    sold: product.ratingsQuantity,
  }
}
