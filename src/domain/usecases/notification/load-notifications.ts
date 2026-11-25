import { Notification } from "../../models/notification/notification-model";

export interface LoadNotificationsParams {
  recipientId: number;
  cursor?: number;
  limit: number;
  unreadOnly?: boolean;
}

export interface LoadNotificationsResult {
  items: Notification[];
  nextCursor: number | null;
}

export interface LoadNotifications {
  load(params: LoadNotificationsParams): Promise<LoadNotificationsResult>;
}
