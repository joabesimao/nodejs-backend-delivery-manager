import { prisma } from "../../../infra/db/prisma/client";
import { VehicleMysqlRepository } from "../../../infra/db/mysql/vehicle-repository/vehicle-repository";

export const makeVehicleRepository = (): VehicleMysqlRepository => new VehicleMysqlRepository(prisma);
