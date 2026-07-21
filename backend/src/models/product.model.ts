import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type ProductStatus = "draft" | "published" | "archived";

export interface IProduct {
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: any;
  categoryId: string;
  specifications?: any;
  viewCount: number;
  soldCount: number;
  status: ProductStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  publishedAt?: Date | null;
}

export interface IProductDocument extends IProduct, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    name: {
      type: String,
      required: [true, "Ten san pham la bat buoc"],
      trim: true,
      minlength: [3, "Ten san pham phai co it nhat 3 ky tu"],
      maxlength: [200, "Ten san pham toi da 200 ky tu"],
    },
    slug: {
      type: String,
      required: [true, "Slug san pham la bat buoc"],
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
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Gia san pham la bat buoc"],
      min: [0, "Gia san pham khong duoc am"],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (this: any, value: number) {
          if (value === null || value === undefined) return true;
          return value < this.price;
        },
        message: "Gia khuyen mai ({VALUE}) phai nho hon gia goc",
      },
    },
    stock: {
      type: Number,
      required: [true, "So luong kho la bat buoc"],
      min: [0, "So luong kho khong duoc am"],
      default: 0,
    },
    images: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    categoryId: {
      type: String,
      ref: "Category",
      required: [true, "Danh muc san pham la bat buoc"],
      index: true,
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
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
productSchema.index({ price: 1, status: 1 });
productSchema.index({ soldCount: -1 });

productSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Product = mongoose.model<IProductDocument>("Product", productSchema);

export default Product;
