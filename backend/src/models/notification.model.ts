import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const NOTIFICATION_TYPE = {
  ORDER: "order",
  PROMOTION: "promotion",
  SYSTEM: "system",
  CHAT: "chat",
  REVIEW: "review",
  VENDOR: "vendor",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface INotification {
  userId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  isDeleted: boolean;
}

export interface INotificationDocument extends INotification, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotificationDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    userId: {
      type: String,
      ref: "User",
      required: [true, "Người nhận thông báo là bắt buộc"],
      index: true,
    },

    senderId: {
      type: String,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: [true, "Loại thông báo là bắt buộc"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Tiêu đề thông báo là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề tối đa 200 ký tự"],
    },

    message: {
      type: String,
      required: [true, "Nội dung thông báo là bắt buộc"],
      trim: true,
      maxlength: [1000, "Nội dung tối đa 1000 ký tự"],
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    link: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying unread notifications per user, sorted by time
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isDeleted: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Notification = mongoose.model<INotificationDocument>("Notification", notificationSchema);

export default Notification;
