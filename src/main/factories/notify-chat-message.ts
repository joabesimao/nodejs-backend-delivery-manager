import { NotifyChatMessage } from "../../domain/usecases/notification/notify-chat-message";
import { DbNotifyChatMessage } from "../../data/usecases/notification-usecases/notify-chat-message/db-notify-chat-message";
import { makeNotifyAccounts } from "./notify-accounts";
import { makeNotificationRepository } from "./repositories";

export const makeNotifyChatMessage = (): NotifyChatMessage => {
  const notificationRepository = makeNotificationRepository();
  return new DbNotifyChatMessage(notificationRepository, notificationRepository, makeNotifyAccounts());
};
