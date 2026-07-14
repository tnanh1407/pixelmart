import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string; // Subcategory support referencing Category _id
  isActive: boolean;
}

export interface ICategoryDocument extends ICategory, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategoryDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [2, "Tên danh mục phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên danh mục tối đa 100 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug danh mục là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
    parentId: {
      type: String,
      ref: "Category",
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động tạo index cho search text tên danh mục
categorySchema.index({ name: "text" });

const Category = mongoose.model<ICategoryDocument>("Category", categorySchema);

export default Category;
