import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  PRODUCT: "product",
  ORDER: "order",
} as const;

export interface IChatMessage {
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  type: (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: Date;
}

export interface IChatMessageDocument extends IChatMessage, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema<IChatMessageDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    chatRoomId: {
      type: String,
      ref: "ChatRoom",
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    receiverId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(MESSAGE_TYPE),
      default: MESSAGE_TYPE.TEXT,
    },

    content: {
      type: String,
      required: [true, "Nội dung tin nhắn là bắt buộc"],
      trim: true,
      maxlength: [2000, "Tin nhắn tối đa 2000 ký tự"],
    },

    attachmentUrl: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ chatRoomId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
chatMessageSchema.index({ receiverId: 1, isRead: 1 });

// Update ChatRoom's lastMessage on new message
chatMessageSchema.post("save", async function () {
  const ChatRoom = mongoose.model("ChatRoom");
  await ChatRoom.findByIdAndUpdate(this.chatRoomId, {
    lastMessage: this.content.slice(0, 200),
    lastMessageAt: this.createdAt,
    lastMessageBy: this.senderId,
  });
});

const ChatMessage = mongoose.model<IChatMessageDocument>("ChatMessage", chatMessageSchema);

export default ChatMessage;
