import { Notification, NotificationType } from "../../../domain/models/notification/notification-model";

export interface NotificationReadEvent {
  ids?: number[];
  all?: boolean;
  type?: NotificationType;
  unreadCount: number;
}

export interface NotificationDeletedEvent {
  id: number;
  unreadCount: number;
}

export interface NotificationPublisher {
  publishNew(recipientId: number, notification: Notification, unreadCount: number): void;
  publishRead(recipientId: number, event: NotificationReadEvent): void;
  publishDeleted(recipientId: number, event: NotificationDeletedEvent): void;
}
