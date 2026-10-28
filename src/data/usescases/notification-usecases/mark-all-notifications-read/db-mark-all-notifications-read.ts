import { NotificationType } from "../../../../domain/models/notification/notification-model";
import { MarkAllNotificationsRead } from "../../../../domain/usescases/notification/mark-notification-read";
import { MarkAllNotificationsReadRepository } from "../../../protocols/db/notification/mark-notification-read";
import { CountUnreadNotificationsRepository } from "../../../protocols/db/notification/count-unread-notifications";
import { NotificationPublisher } from "../../../protocols/realtime/notification-publisher";

export class DbMarkAllNotificationsRead implements MarkAllNotificationsRead {
  constructor(
    private readonly markAllNotificationsReadRepository: MarkAllNotificationsReadRepository,
    private readonly countUnreadNotificationsRepository: CountUnreadNotificationsRepository,
    private readonly notificationPublisher: NotificationPublisher
  ) {}

  async markAllRead(recipientId: number, type?: NotificationType): Promise<number> {
    const updated = await this.markAllNotificationsReadRepository.markAllRead(recipientId, type);
    if (updated > 0) {
      const unreadCount = await this.countUnreadNotificationsRepository.countUnread(recipientId);
      this.notificationPublisher.publishRead(recipientId, { all: true, type, unreadCount });
    }
    return updated;
  }
}
