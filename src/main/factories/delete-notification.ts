import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteNotification } from "../../data/usescases/notification-usecases/delete-notification/db-delete-notification";
import { DeleteNotificationController } from "../../presentation/controllers/notification-controllers/delete-notification/delete-notification";
import { SocketNotificationPublisher } from "../realtime/socket-notification-publisher";
import { makeNotificationRepository } from "./notify-accounts";

export const makeDeleteNotificationController = (): Controller => {
  const notificationRepository = makeNotificationRepository();
  const deleteNotification = new DbDeleteNotification(notificationRepository, notificationRepository, new SocketNotificationPublisher());
  return new DeleteNotificationController(deleteNotification);
};
