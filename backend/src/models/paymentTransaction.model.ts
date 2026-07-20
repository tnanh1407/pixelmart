import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const TRANSACTION_TYPE = {
  PAYMENT: "payment",
  REFUND: "refund",
} as const;

export interface IPaymentTransaction {
  orderId: string;
  userId: string;
  amount: number;
  method: string;
  type: (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
  gateway?: string;
  gatewayTransactionId?: string;
  status: (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
  gatewayResponse?: Record<string, any>;
}

export interface IPaymentTransactionDocument extends IPaymentTransaction, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new mongoose.Schema<IPaymentTransactionDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    orderId: {
      type: String,
      ref: "Order",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      default: TRANSACTION_TYPE.PAYMENT,
    },

    gateway: {
      type: String,
      default: null,
    },

    gatewayTransactionId: {
      type: String,
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
      index: true,
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentTransactionSchema.index({ orderId: 1, type: 1 });
paymentTransactionSchema.index({ userId: 1, status: 1, createdAt: -1 });

const PaymentTransaction = mongoose.model<IPaymentTransactionDocument>("PaymentTransaction", paymentTransactionSchema);

export default PaymentTransaction;
