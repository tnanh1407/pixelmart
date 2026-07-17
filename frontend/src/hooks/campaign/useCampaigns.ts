import { useQuery } from '@tanstack/react-query'
import { campaignService } from '@/services/campaign.service'

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getActiveCampaigns(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getCampaignById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export default useCampaigns
