import { prisma } from "../../../infra/db/prisma/client";
import { FuelRefillMysqlRepository } from "../../../infra/db/prisma/fuel-refill-repository/fuel-refill-repository";

export const makeFuelRefillRepository = (): FuelRefillMysqlRepository => new FuelRefillMysqlRepository(prisma);
