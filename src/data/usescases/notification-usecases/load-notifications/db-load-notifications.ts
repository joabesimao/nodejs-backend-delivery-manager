import {
  LoadNotifications,
  LoadNotificationsParams,
  LoadNotificationsResult,
} from "../../../../domain/usescases/notification/load-notifications";
import { LoadNotificationsRepository } from "../../../protocols/db/notification/load-notifications";

export const MAX_NOTIFICATIONS_PAGE_SIZE = 50;

export class DbLoadNotifications implements LoadNotifications {
  constructor(private readonly loadNotificationsRepository: LoadNotificationsRepository) {}

  async load(params: LoadNotificationsParams): Promise<LoadNotificationsResult> {
    const limit = Math.min(Math.max(Math.trunc(params.limit) || 1, 1), MAX_NOTIFICATIONS_PAGE_SIZE);
    return await this.loadNotificationsRepository.load({ ...params, limit });
  }
}
