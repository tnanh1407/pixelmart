import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISpecification {
  key: string;
  value: string;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface IProduct {
  name: string;
  slug: string;
  sku?: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: string[];
  gallery?: string[];
  categoryId: string;
  storeId: string;
  tags?: string[];
  specifications?: ISpecification[];
  weight?: number;
  dimensions?: IDimensions;
  ratingsAverage: number;
  ratingsQuantity: number;
  viewCount: number;
  soldCount: number;
  wishlistCount: number;
  isFeatured: boolean;
  status: ProductStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  publishedAt?: Date | null;
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

const dimensionsSchema = new mongoose.Schema<IDimensions>(
  {
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
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
        validator: function (this: any, value: number) {
          if (value === null || value === undefined) return true;
          return value < this.price;
        },
        message: "Giá khuyến mãi ({VALUE}) phải nhỏ hơn giá gốc",
      },
    },
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
    gallery: {
      type: [String],
      default: [],
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
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    weight: {
      type: Number,
      default: null,
    },
    dimensions: {
      type: dimensionsSchema,
      default: null,
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
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ categoryId: 1, status: 1, isDeleted: 1 });
productSchema.index({ storeId: 1, status: 1, isDeleted: 1 });
productSchema.index({ price: 1, status: 1 });
productSchema.index({ soldCount: -1 });

// Auto-set publishedAt when status changes to published
productSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Product = mongoose.model<IProductDocument>("Product", productSchema);

export default Product;
