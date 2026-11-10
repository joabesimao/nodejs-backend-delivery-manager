import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeLoadNotificationsController } from "../factories/load-notifications";
import { makeCountUnreadNotificationsController } from "../factories/count-unread-notifications";
import { makeMarkNotificationReadController } from "../factories/mark-notification-read";
import { makeMarkAllNotificationsReadController } from "../factories/mark-all-notifications-read";
import { makeDeleteNotificationController } from "../factories/delete-notification";
import { makeBroadcastNoticeController } from "../factories/broadcast-notice";
import { ADMIN_ROLES } from "../config/roles";

export default (router: Router): void => {
  router.get(
    "/notifications",
    auth(),
    adaptRoute(makeLoadNotificationsController())
  );
  router.get(
    "/notifications/unread-count",
    auth(),
    adaptRoute(makeCountUnreadNotificationsController())
  );
  router.put(
    "/notifications/read-all",
    auth(),
    adaptRoute(makeMarkAllNotificationsReadController())
  );
  router.put(
    "/notifications/:id/read",
    auth(),
    adaptRoute(makeMarkNotificationReadController())
  );
  router.delete(
    "/notifications/:id",
    auth(),
    adaptRoute(makeDeleteNotificationController())
  );
  router.post(
    "/notifications/broadcast",
    auth(ADMIN_ROLES),
    adaptRoute(makeBroadcastNoticeController())
  );
};
