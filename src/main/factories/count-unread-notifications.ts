import { Controller } from "../../presentation/protocols/controller";
import { DbCountUnreadNotifications } from "../../data/usescases/notification-usecases/count-unread-notifications/db-count-unread-notifications";
import { CountUnreadNotificationsController } from "../../presentation/controllers/notification-controllers/count-unread-notifications/count-unread-notifications";
import { makeNotificationRepository } from "./notify-accounts";

export const makeCountUnreadNotificationsController = (): Controller => {
  return new CountUnreadNotificationsController(new DbCountUnreadNotifications(makeNotificationRepository()));
};
