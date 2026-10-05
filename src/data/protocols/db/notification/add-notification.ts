import { Notification, NotificationType } from "../../../../domain/models/notification/notification-model";

export interface AddNotificationData {
  recipientId: number;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  data?: Record<string, unknown>;
  dedupeKey?: string;
}

export interface AddNotificationRepository {
  add(data: AddNotificationData): Promise<Notification>;
}
