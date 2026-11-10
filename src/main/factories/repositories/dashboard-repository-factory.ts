import { prisma } from "../../../infra/db/prisma/client";
import { DashboardMysqlRepository } from "../../../infra/db/mysql/dashboard-repository/dashboard-repository";

export const makeDashboardRepository = (): DashboardMysqlRepository => new DashboardMysqlRepository(prisma);
