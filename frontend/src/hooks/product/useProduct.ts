import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export default useProduct
