import { prisma } from "../../../infra/db/prisma/client";
import { NotificationMysqlRepository } from "../../../infra/db/prisma/notification-repository/notification-repository";

export const makeNotificationRepository = (): NotificationMysqlRepository => new NotificationMysqlRepository(prisma);
