import { Controller } from "../../presentation/protocols/controller";
import { DbMarkAllNotificationsRead } from "../../data/usescases/notification-usecases/mark-all-notifications-read/db-mark-all-notifications-read";
import { MarkAllNotificationsReadController } from "../../presentation/controllers/notification-controllers/mark-all-notifications-read/mark-all-notifications-read";
import { SocketNotificationPublisher } from "../realtime/socket-notification-publisher";
import { makeNotificationRepository } from "./notify-accounts";

export const makeMarkAllNotificationsReadController = (): Controller => {
  const notificationRepository = makeNotificationRepository();
  const markAllRead = new DbMarkAllNotificationsRead(notificationRepository, notificationRepository, new SocketNotificationPublisher());
  return new MarkAllNotificationsReadController(markAllRead);
};
