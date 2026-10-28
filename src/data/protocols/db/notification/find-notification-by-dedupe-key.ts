import { Notification } from "../../../../domain/models/notification/notification-model";

export interface FindNotificationByDedupeKeyRepository {
  findByDedupeKey(
    recipientId: number,
    dedupeKey: string,
    options?: { unreadOnly?: boolean; includeDeleted?: boolean }
  ): Promise<Notification | null>;
}
