import { Notification, NotificationType } from "../../../../domain/models/notification/notification-model";

export interface MarkNotificationReadRepository {
  markRead(recipientId: number, id: number): Promise<Notification | null>;
}

export interface MarkAllNotificationsReadRepository {
  markAllRead(recipientId: number, type?: NotificationType): Promise<number>;
}
