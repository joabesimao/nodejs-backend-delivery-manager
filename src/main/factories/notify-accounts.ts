import { NotifyAccounts } from "../../domain/usecases/notification/notify-accounts";
import { DbNotifyAccounts } from "../../data/usecases/notification-usecases/notify-accounts/db-notify-accounts";
import { SocketNotificationPublisher } from "../realtime/socket-notification-publisher";
import { KeyedLock } from "../../data/helpers/keyed-lock";
import { makeNotificationRepository } from "./repositories";

const dedupeLock = new KeyedLock();

export const makeNotifyAccounts = (): NotifyAccounts => {
  const notificationRepository = makeNotificationRepository();
  return new DbNotifyAccounts(
    notificationRepository,
    notificationRepository,
    notificationRepository,
    notificationRepository,
    new SocketNotificationPublisher(),
    dedupeLock
  );
};
