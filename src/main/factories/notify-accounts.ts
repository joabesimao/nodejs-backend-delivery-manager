import { NotifyAccounts } from "../../domain/usescases/notification/notify-accounts";
import { DbNotifyAccounts } from "../../data/usescases/notification-usecases/notify-accounts/db-notify-accounts";
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
