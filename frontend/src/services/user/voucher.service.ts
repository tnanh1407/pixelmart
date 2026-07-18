import api from '../api'
import type { IVoucher, VoucherListResponse, ValidateVoucherResponse } from '@/types/voucher.types'

export const voucherService = {
  async getAvailableVouchers(params?: { storeId?: string; orderValue?: number }): Promise<IVoucher[]> {
    const { data } = await api.get('/vouchers/available', { params })
    return data.data || data
  },

  async getVoucherByCode(code: string): Promise<IVoucher> {
    const { data } = await api.get(`/vouchers/code/${code}`)
    return data.data || data
  },

  async validateVoucher(code: string, orderValue: number, storeId?: string): Promise<ValidateVoucherResponse> {
    const { data } = await api.post('/vouchers/validate', { code, orderValue, storeId })
    return data.data
  },
}
