import { Controller } from "../../presentation/protocols/controller";
import { DbBroadcastNotice } from "../../data/usescases/notification-usecases/broadcast-notice/db-broadcast-notice";
import { BroadcastNoticeController } from "../../presentation/controllers/notification-controllers/broadcast-notice/broadcast-notice";
import { makeNotificationRepository, makeNotifyAccounts } from "./notify-accounts";
import { makeBroadcastNoticeValidation } from "./broadcast-notice-validation";

export const makeBroadcastNoticeController = (): Controller => {
  const notificationRepository = makeNotificationRepository();
  const broadcastNotice = new DbBroadcastNotice(notificationRepository, notificationRepository, makeNotifyAccounts());
  return new BroadcastNoticeController(broadcastNotice, makeBroadcastNoticeValidation());
};
