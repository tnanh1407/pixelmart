import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IChatRoom {
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  lastMessageBy?: string;
}

export interface IChatRoomDocument extends IChatRoom, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const chatRoomSchema = new mongoose.Schema<IChatRoomDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,

    participants: {
      type: [String],
      ref: "User",
      required: true,
      validate: {
        validator: function (value: string[]) {
          return value.length === 2;
        },
        message: "Phòng chat phải có đúng 2 người tham gia",
      },
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    lastMessageBy: {
      type: String,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ lastMessageAt: -1 });

const ChatRoom = mongoose.model<IChatRoomDocument>("ChatRoom", chatRoomSchema);

export default ChatRoom;
