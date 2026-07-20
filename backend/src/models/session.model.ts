import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISession {
  userId: string;
  refreshToken: string;
  isRevoked: boolean;
  expiresAt: Date;
  lastActiveAt?: Date;
}

export interface ISessionDocument extends ISession, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISessionDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ userId: 1, isRevoked: 1 });

const Session = mongoose.model<ISessionDocument>("Session", sessionSchema);

export default Session;
