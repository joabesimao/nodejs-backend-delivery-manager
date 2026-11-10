import { prisma } from "../../../infra/db/prisma/client";
import { FuelRefillMysqlRepository } from "../../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";

export const makeFuelRefillRepository = (): FuelRefillMysqlRepository => new FuelRefillMysqlRepository(prisma);
