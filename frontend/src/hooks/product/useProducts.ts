import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import type { GetProductsParams } from '@/types/product.types'

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    staleTime: 2 * 60 * 1000,
  })
}

export default useProducts
