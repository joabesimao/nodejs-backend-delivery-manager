import { Notification } from "../../../../domain/models/notification/notification-model";
import { MarkNotificationRead } from "../../../../domain/usescases/notification/mark-notification-read";
import { MarkNotificationReadRepository } from "../../../protocols/db/notification/mark-notification-read";
import { CountUnreadNotificationsRepository } from "../../../protocols/db/notification/count-unread-notifications";
import { NotificationPublisher } from "../../../protocols/realtime/notification-publisher";

export class DbMarkNotificationRead implements MarkNotificationRead {
  constructor(
    private readonly markNotificationReadRepository: MarkNotificationReadRepository,
    private readonly countUnreadNotificationsRepository: CountUnreadNotificationsRepository,
    private readonly notificationPublisher: NotificationPublisher
  ) {}

  async markRead(recipientId: number, id: number): Promise<Notification | null> {
    const notification = await this.markNotificationReadRepository.markRead(recipientId, id);
    if (notification) {
      const unreadCount = await this.countUnreadNotificationsRepository.countUnread(recipientId);
      this.notificationPublisher.publishRead(recipientId, { ids: [id], unreadCount });
    }
    return notification;
  }
}
