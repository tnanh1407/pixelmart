import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ROLES, GENDERS } from "../constants/roles.js";
import { hashPassword } from "../utils/bcrypt.js";
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    gender: {
        type: String,
        enum: Object.values(GENDERS),
        default: GENDERS.OTHER,
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER,
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: [/^(0|\+84)[0-9]{9,10}$/, "Invalid phone number"],
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
userSchema.pre("validate", async function () {
    if (this.provider === "local" && !this.password) {
        this.invalidate("password", "Password is required");
    }
});
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await hashPassword(this.password);
});
userSchema.set("toJSON", {
    transform(doc, ret) {
        const { password, __v, ...rest } = ret;
        return rest;
    },
});
const User = mongoose.model("User", userSchema);
export default User;
