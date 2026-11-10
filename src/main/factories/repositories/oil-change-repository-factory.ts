import { prisma } from "../../../infra/db/prisma/client";
import { OilChangeMysqlRepository } from "../../../infra/db/mysql/oil-change-repository/oil-change-repository";

export const makeOilChangeRepository = (): OilChangeMysqlRepository => new OilChangeMysqlRepository(prisma);
