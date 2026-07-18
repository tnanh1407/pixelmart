import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reviewService } from '@/services/user/review.service'
import type { CreateReviewPayload } from '@/types/review.types'

export function useProductReviews(productId: string, params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['reviews', productId, params],
    queryFn: () => reviewService.getProductReviews(productId, params),
    enabled: !!productId,
  })
}

export function useMyReviews(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['my-reviews', params],
    queryFn: () => reviewService.getMyReviews(params),
  })
}

export function useReviewMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reviews'] })
    queryClient.invalidateQueries({ queryKey: ['my-reviews'] })
    queryClient.invalidateQueries({ queryKey: ['product'] })
  }

  const createReview = useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),
    onSuccess: () => { invalidate(); toast.success('Đánh giá thành công!') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi gửi đánh giá'),
  })

  const updateReview = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateReviewPayload> }) => reviewService.updateReview(id, payload),
    onSuccess: () => { invalidate(); toast.success('Cập nhật đánh giá thành công') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi cập nhật'),
  })

  const deleteReview = useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => { invalidate(); toast.success('Đã xóa đánh giá') },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi xóa'),
  })

  return { createReview, updateReview, deleteReview }
}
