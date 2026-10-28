import { Controller } from "../../presentation/protocols/controller";
import { DbMarkNotificationRead } from "../../data/usescases/notification-usecases/mark-notification-read/db-mark-notification-read";
import { MarkNotificationReadController } from "../../presentation/controllers/notification-controllers/mark-notification-read/mark-notification-read";
import { SocketNotificationPublisher } from "../realtime/socket-notification-publisher";
import { makeNotificationRepository } from "./notify-accounts";

export const makeMarkNotificationReadController = (): Controller => {
  const notificationRepository = makeNotificationRepository();
  const markRead = new DbMarkNotificationRead(notificationRepository, notificationRepository, new SocketNotificationPublisher());
  return new MarkNotificationReadController(markRead);
};
