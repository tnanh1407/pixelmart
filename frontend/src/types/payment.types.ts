export interface MomoCreatePaymentResponse {
  partnerCode: string
  requestId: string
  orderId: string
  amount: number
  responseTime: number
  message: string
  resultCode: number
  payUrl: string
  deeplink?: string
  qrCodeUrl?: string
}

export interface MomoCreatePaymentPayload {
  amount: number
  orderId: string
  orderInfo?: string
  extraData?: string
}

export interface MomoPaymentStatus {
  orderId: string
  requestId: string
  amount: number
  paymentStatus: string
  orderStatus: string
}
