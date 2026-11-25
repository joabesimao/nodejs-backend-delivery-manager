import { Notification, NotificationType } from "../../models/notification/notification-model";

export interface MarkNotificationRead {
  markRead(recipientId: number, id: number): Promise<Notification | null>;
}

export interface MarkAllNotificationsRead {
  markAllRead(recipientId: number, type?: NotificationType): Promise<number>;
}
