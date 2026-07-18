export type MessageType = "text" | "image" | "product" | "order"

export interface IChatRoom {
  _id: string
  participants: string[]
  lastMessage?: string
  lastMessageAt?: string
  lastMessageBy?: string
  createdAt: string
  updatedAt: string
}

export interface IChatMessage {
  _id: string
  chatRoomId: string
  senderId: string | { _id: string; name: string; avatar?: string }
  receiverId: string | { _id: string; name: string; avatar?: string }
  type: MessageType
  content: string
  attachmentUrl?: string
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface SendMessagePayload {
  chatRoomId?: string
  receiverId: string
  type?: MessageType
  content: string
  attachmentUrl?: string
}
