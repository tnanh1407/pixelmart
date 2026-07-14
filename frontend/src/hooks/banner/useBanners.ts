import { useQuery } from '@tanstack/react-query'
import { bannerService } from '@/services/banner.service'

export function useBanners(position?: string) {
  return useQuery({
    queryKey: ['banners', position],
    queryFn: () => bannerService.getActiveBanners(position),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: () => bannerService.getBannerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export default useBanners
