import { prisma } from "../../../infra/db/prisma/client";
import { DashboardMysqlRepository } from "../../../infra/db/prisma/dashboard-repository/dashboard-repository";

export const makeDashboardRepository = (): DashboardMysqlRepository => new DashboardMysqlRepository(prisma);
