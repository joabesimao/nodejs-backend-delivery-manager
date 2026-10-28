import { CountUnreadNotifications } from "../../../../domain/usescases/notification/count-unread-notifications";
import { CountUnreadNotificationsRepository } from "../../../protocols/db/notification/count-unread-notifications";

export class DbCountUnreadNotifications implements CountUnreadNotifications {
  constructor(private readonly countUnreadNotificationsRepository: CountUnreadNotificationsRepository) {}

  async countUnread(recipientId: number): Promise<number> {
    return await this.countUnreadNotificationsRepository.countUnread(recipientId);
  }
}
