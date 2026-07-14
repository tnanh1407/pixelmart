import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISpecification {
  key: string;
  value: string;
}

export interface IFlashSale {
  price: number;
  stock: number;
  sold: number;
  startDate: Date;
  endDate: Date;
}

export interface IProduct {
  name: string;
  slug: string;
  sku?: string;
  brand?: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: string[];
  categoryId: string;
  storeId: string;
  specifications?: ISpecification[];
  ratingsAverage: number;
  ratingsQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  flashSale?: IFlashSale | null;
}

export interface IProductDocument extends IProduct, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const specificationSchema = new mongoose.Schema<ISpecification>(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const flashSaleSchema = new mongoose.Schema<IFlashSale>(
  {
    price: {
      type: Number,
      required: [true, "Giá Flash Sale là bắt buộc"],
      min: [0, "Giá Flash Sale không được âm"],
    },
    stock: {
      type: Number,
      required: [true, "Số lượng hàng Flash Sale là bắt buộc"],
      min: [0, "Số lượng hàng không được âm"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Số lượng đã bán không được âm"],
    },
    startDate: {
      type: Date,
      required: [true, "Thời gian bắt đầu Flash Sale là bắt buộc"],
    },
    endDate: {
      type: Date,
      required: [true, "Thời gian kết thúc Flash Sale là bắt buộc"],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      minlength: [3, "Tên sản phẩm phải có ít nhất 3 ký tự"],
      maxlength: [200, "Tên sản phẩm tối đa 200 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug sản phẩm là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá sản phẩm không được âm"],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function(this: IProductDocument, value: number) {
          if (value === null || value === undefined) return true;
          return value < this.price;
        },
        message: "Giá khuyến mãi ({VALUE}) phải nhỏ hơn giá gốc"
      }
    } as any,
    stock: {
      type: Number,
      required: [true, "Số lượng kho là bắt buộc"],
      min: [0, "Số lượng kho không được âm"],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(value: string[]) {
          return value.length > 0;
        },
        message: "Sản phẩm phải có ít nhất một ảnh"
      }
    },
    categoryId: {
      type: String,
      ref: "Category",
      required: [true, "Danh mục sản phẩm là bắt buộc"],
      index: true,
    },
    storeId: {
      type: String,
      ref: "Store",
      required: [true, "Cửa hàng bán sản phẩm là bắt buộc"],
      index: true,
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Đánh giá trung bình từ 0 đến 5"],
      max: [5, "Đánh giá trung bình từ 0 đến 5"],
      set: (val: number) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    flashSale: {
      type: flashSaleSchema,
      default: null,
      validate: {
        validator: function(this: IProductDocument, value: any) {
          if (!value) return true;
          if (value.price >= this.price) return false;
          if (new Date(value.startDate) >= new Date(value.endDate)) return false;
          return true;
        },
        message: "Dữ liệu cấu hình Flash Sale không hợp lệ (Giá Flash Sale phải nhỏ hơn giá gốc và thời gian bắt đầu phải trước kết thúc)"
      }
    } as any,
  },
  {
    timestamps: true,
  }
);

// Tự động tạo text index cho tìm kiếm sản phẩm theo tên, thương hiệu và mô tả
productSchema.index({ name: "text", brand: "text", description: "text" });

const Product = mongoose.model<IProductDocument>("Product", productSchema);

export default Product;
