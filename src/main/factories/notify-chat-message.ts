import { NotifyChatMessage } from "../../domain/usescases/notification/notify-chat-message";
import { DbNotifyChatMessage } from "../../data/usescases/notification-usecases/notify-chat-message/db-notify-chat-message";
import { makeNotificationRepository, makeNotifyAccounts } from "./notify-accounts";

export const makeNotifyChatMessage = (): NotifyChatMessage => {
  const notificationRepository = makeNotificationRepository();
  return new DbNotifyChatMessage(notificationRepository, notificationRepository, makeNotifyAccounts());
};
