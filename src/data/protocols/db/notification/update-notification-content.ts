import { Notification } from "../../../../domain/models/notification/notification-model";

export interface UpdateNotificationContentData {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface UpdateNotificationContentRepository {
  updateContent(id: number, data: UpdateNotificationContentData): Promise<Notification>;
}
