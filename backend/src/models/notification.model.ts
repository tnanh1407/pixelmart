import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const NOTIFICATION_TYPE = {
  ORDER: "order",
  PROMOTION: "promotion",
  SYSTEM: "system",
  REVIEW: "review",
  REPORT_SYSTEM: "report_system",
  REPORT_SHOP: "report_shop",
  REPORT_REVIEW: "report_review",
  AUTH: "auth",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface INotification {
  userId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  isRead: boolean;
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
      required: [true, "Nguoi nhan thong bao la bat buoc"],
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
      required: [true, "Loai thong bao la bat buoc"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Tieu de thong bao la bat buoc"],
      trim: true,
      maxlength: [200, "Tieu de toi da 200 ky tu"],
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isDeleted: 1 });

const Notification = mongoose.model<INotificationDocument>("Notification", notificationSchema);

export default Notification;
