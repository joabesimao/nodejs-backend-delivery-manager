import { DeleteNotification } from "../../../../domain/usescases/notification/delete-notification";
import { DeleteNotificationRepository } from "../../../protocols/db/notification/delete-notification";
import { CountUnreadNotificationsRepository } from "../../../protocols/db/notification/count-unread-notifications";
import { NotificationPublisher } from "../../../protocols/realtime/notification-publisher";

export class DbDeleteNotification implements DeleteNotification {
  constructor(
    private readonly deleteNotificationRepository: DeleteNotificationRepository,
    private readonly countUnreadNotificationsRepository: CountUnreadNotificationsRepository,
    private readonly notificationPublisher: NotificationPublisher
  ) {}

  async delete(recipientId: number, id: number): Promise<boolean> {
    const deleted = await this.deleteNotificationRepository.delete(recipientId, id);
    if (deleted) {
      const unreadCount = await this.countUnreadNotificationsRepository.countUnread(recipientId);
      this.notificationPublisher.publishDeleted(recipientId, { id, unreadCount });
    }
    return deleted;
  }
}
