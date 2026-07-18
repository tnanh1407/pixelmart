import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;

export const PAYMENT_METHOD = {
  COD: "cod",
  BANK_TRANSFER: "bank_transfer",
  E_WALLET: "e_wallet",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  storeId: string;
  storeName: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
  subtotal: number;
}

export interface IShippingAddress {
  receiverName: string;
  receiverPhone: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  streetAddress: string;
}

export interface IOrder {
  userId: string;
  storeId: string;
  orderCode: string;
  status: OrderStatus;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  shippingFee: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  voucherId?: string;
  voucherCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  shippingTrackingNumber?: string;
  shippingCarrier?: string;
  note?: string;
  cancelReason?: string;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface IOrderDocument extends IOrder, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    productId: {
      type: String,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      default: "",
    },
    productSlug: {
      type: String,
      default: "",
    },
    storeId: {
      type: String,
      ref: "Store",
      required: true,
    },
    storeName: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>(
  {
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    provinceName: { type: String, required: true },
    districtName: { type: String, required: true },
    wardName: { type: String, required: true },
    streetAddress: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema<IOrderDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    userId: {
      type: String,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
      index: true,
    },

    storeId: {
      type: String,
      ref: "Store",
      required: [true, "Cửa hàng là bắt buộc"],
      index: true,
    },

    orderCode: {
      type: String,
      required: [true, "Mã đơn hàng là bắt buộc"],
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: [true, "Danh sách sản phẩm là bắt buộc"],
      validate: {
        validator: function (value: IOrderItem[]) {
          return value.length > 0;
        },
        message: "Đơn hàng phải có ít nhất 1 sản phẩm",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Địa chỉ giao hàng là bắt buộc"],
    },

    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    voucherId: {
      type: String,
      ref: "Voucher",
      default: null,
    },

    voucherCode: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: [true, "Phương thức thanh toán là bắt buộc"],
      default: PAYMENT_METHOD.COD,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },

    transactionId: {
      type: String,
      default: null,
      index: true,
    },

    shippingTrackingNumber: {
      type: String,
      default: null,
    },

    shippingCarrier: {
      type: String,
      default: null,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    cancelReason: {
      type: String,
      trim: true,
      default: null,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, status: 1, createdAt: -1 });
orderSchema.index({ storeId: 1, status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

// Auto-set timestamps on status changes
orderSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "confirmed" && !this.confirmedAt) {
      this.confirmedAt = new Date();
    }
    if (this.status === "shipping" && !this.shippedAt) {
      this.shippedAt = new Date();
    }
    if (this.status === "delivered" && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
    if (this.status === "cancelled" && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
    if (this.status === "delivered" && this.paymentMethod === "cod") {
      this.paymentStatus = "paid";
    }
  }
});

const Order = mongoose.model<IOrderDocument>("Order", orderSchema);

export default Order;
