import { Notification } from "../../domain/models/notification/notification-model";
import {
  NotificationDeletedEvent,
  NotificationPublisher,
  NotificationReadEvent,
} from "../../data/protocols/realtime/notification-publisher";
import { emitToAccount } from "./realtime-state";

export class SocketNotificationPublisher implements NotificationPublisher {
  publishNew(recipientId: number, notification: Notification, unreadCount: number): void {
    emitToAccount(recipientId, "notification:new", { notification, unreadCount });
  }

  publishRead(recipientId: number, event: NotificationReadEvent): void {
    emitToAccount(recipientId, "notification:read", event);
  }

  publishDeleted(recipientId: number, event: NotificationDeletedEvent): void {
    emitToAccount(recipientId, "notification:deleted", event);
  }
}
