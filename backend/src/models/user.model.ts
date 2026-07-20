import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ROLES, GENDERS } from "../constants/roles.js";
import { hashPassword } from "../utils/bcrypt.js";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  gender: (typeof GENDERS)[keyof typeof GENDERS];
  role: (typeof ROLES)[keyof typeof ROLES];
  phone?: string;
  provider: "local" | "google";
  googleId?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface IUserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
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
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", async function () {
  if (this.isNew && this.provider === "local" && !this.password) {
    this.invalidate("password", "Password is required");
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password as string);
});

userSchema.index({ role: 1, isActive: 1 });

userSchema.set("toJSON", {
  transform(doc, ret) {
    const { password, __v, ...rest } = ret;
    return rest;
  },
});

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
