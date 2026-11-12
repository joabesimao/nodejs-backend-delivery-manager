import { prisma } from "../../../infra/db/prisma/client";
import { UnitStoreMysqlRepository } from "../../../infra/db/mysql/unit-store-repository/unit-store-repository";

export const makeUnitStoreRepository = (): UnitStoreMysqlRepository => new UnitStoreMysqlRepository(prisma);
