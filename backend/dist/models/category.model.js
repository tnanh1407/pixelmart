import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: [true, "Ten danh muc la bat buoc"],
        unique: true,
        trim: true,
        minlength: [2, "Ten danh muc phai co it nhat 2 ky tu"],
        maxlength: [100, "Ten danh muc toi da 100 ky tu"],
    },
    slug: {
        type: String,
        required: [true, "Slug danh muc la bat buoc"],
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
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
});
categorySchema.index({ name: "text" });
const Category = mongoose.model("Category", categorySchema);
export default Category;
