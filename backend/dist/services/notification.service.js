import Notification from "../models/notification.model.js";
import { AppError } from "../middlewares/error.middleware.js";
class NotificationService {
    async getNotifications(userId, query = {}) {
        const { page = 1, limit = 20, type, isRead } = query;
        const filter = { userId, isDeleted: false };
        if (type)
            filter.type = type;
        if (isRead !== undefined)
            filter.isRead = isRead === "true" || isRead === true;
        const skipIndex = (Number(page) - 1) * Number(limit);
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(Number(limit))
            .populate("senderId", "name avatar");
        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({
            userId,
            isRead: false,
            isDeleted: false,
        });
        return {
            notifications,
            unreadCount,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async getUnreadCount(userId) {
        return await Notification.countDocuments({
            userId,
            isRead: false,
            isDeleted: false,
        });
    }
    async markAsRead(userId, notificationId) {
        const notification = await Notification.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
        if (!notification) {
            throw new AppError("Thong bao khong ton tai", 404);
        }
        return notification;
    }
    async markAllAsRead(userId) {
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        return { message: "Da danh dau tat ca la da doc" };
    }
    async deleteNotification(userId, notificationId) {
        const notification = await Notification.findOneAndUpdate({ _id: notificationId, userId }, { isDeleted: true }, { new: true });
        if (!notification) {
            throw new AppError("Thong bao khong ton tai", 404);
        }
        return { message: "Da xoa thong bao" };
    }
    async deleteAllNotifications(userId) {
        await Notification.updateMany({ userId, isDeleted: false }, { isDeleted: true });
        return { message: "Da xoa tat ca thong bao" };
    }
    async createNotification(data) {
        return await Notification.create(data);
    }
    async createBulkNotifications(userIds, data) {
        const notifications = userIds.map((userId) => ({
            userId,
            ...data,
        }));
        return await Notification.insertMany(notifications);
    }
}
export default new NotificationService();
