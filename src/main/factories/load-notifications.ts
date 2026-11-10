import { Controller } from "../../presentation/protocols/controller";
import { DbLoadNotifications } from "../../data/usescases/notification-usecases/load-notifications/db-load-notifications";
import { LoadNotificationsController } from "../../presentation/controllers/notification-controllers/load-notifications/load-notifications";
import { makeNotificationRepository } from "./repositories";

export const makeLoadNotificationsController = (): Controller => {
  return new LoadNotificationsController(new DbLoadNotifications(makeNotificationRepository()));
};
