export const MOMO_CONFIG = {
  PARTNER_CODE: "MOMOBKUN20120729",
  ACCESS_KEY: "klm05TvNBzhg7h7j",
  SECRET_KEY: "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa",
  ENDPOINT: "https://test-payment.momo.vn/v2/gateway/api/create",
  REDIRECT_URL: "http://localhost:5173/payment/momo/callback",
  IPN_URL: "http://localhost:5000/api/v1/payment/momo/ipn",
  REQUEST_TYPE: "captureWallet",
  LANG: "vi",
};

export const MOMO_RESPONSE_CODE = {
  SUCCESS: 0,
  INVALID_SIGNATURE: 10,
  INVALID_AMOUNT: 11,
  USER_CANCELLED: 1001,
  INSUFFICIENT_FUNDS: 1002,
  TRANSACTION_LIMIT: 1003,
  ACCOUNT_LOCKED: 1006,
} as const;

export type MomoResponseCode = (typeof MOMO_RESPONSE_CODE)[keyof typeof MOMO_RESPONSE_CODE];

export interface MomoCreatePaymentRequest {
  amount: number;
  orderId: string;
  orderInfo: string;
  extraData?: string;
}

export interface MomoCreatePaymentResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export interface MomoIPNRequest {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}
