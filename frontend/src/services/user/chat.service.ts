import api from "../client"
import type { IChatRoom, IChatMessage, SendMessagePayload } from '@/types/chat.types'

export const chatService = {
  async getChatRooms(): Promise<IChatRoom[]> {
    const { data } = await api.get('/chat/rooms')
    return data.data || data
  },

  async getMessages(chatRoomId: string, params?: Record<string, unknown>): Promise<IChatMessage[]> {
    const { data } = await api.get(`/chat/rooms/${chatRoomId}/messages`, { params })
    return data.data || data
  },

  async sendMessage(payload: SendMessagePayload): Promise<IChatMessage> {
    const { data } = await api.post('/chat/messages', payload)
    return data.data
  },

  async markAsRead(chatRoomId: string) {
    const { data } = await api.patch(`/chat/rooms/${chatRoomId}/read`)
    return data
  },

  async createChatRoom(receiverId: string): Promise<IChatRoom> {
    const { data } = await api.post('/chat/rooms', { receiverId })
    return data.data
  },
}
