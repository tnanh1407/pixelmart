import api from '../api'
import type { MomoCreatePaymentPayload, MomoCreatePaymentResponse, MomoPaymentStatus } from '@/types/payment.types'

export const paymentService = {
  async createMomoPayment(payload: MomoCreatePaymentPayload): Promise<MomoCreatePaymentResponse> {
    const { data } = await api.post('/payment/momo/create-payment', payload)
    return data.data || data
  },

  async checkMomoStatus(orderId: string, requestId: string): Promise<MomoPaymentStatus> {
    const { data } = await api.get('/payment/momo/check-status', { params: { orderId, requestId } })
    return data.data || data
  },
}
