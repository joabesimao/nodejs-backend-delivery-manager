import { NotifyAccounts } from "../../domain/usescases/notification/notify-accounts";
import { DbNotifyAccounts } from "../../data/usescases/notification-usecases/notify-accounts/db-notify-accounts";
import { NotificationMysqlRepository } from "../../infra/db/mysql/notification-repository/notification-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { SocketNotificationPublisher } from "../realtime/socket-notification-publisher";
import { KeyedLock } from "../../data/helpers/keyed-lock";

// Uma só trava para todas as instâncias (chat via socket e REST, veículos, avisos).
const dedupeLock = new KeyedLock();

export const makeNotificationRepository = (): NotificationMysqlRepository => new NotificationMysqlRepository(prisma);

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
