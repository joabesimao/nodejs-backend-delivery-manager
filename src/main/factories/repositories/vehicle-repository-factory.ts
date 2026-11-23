import { prisma } from "../../../infra/db/prisma/client";
import { VehicleMysqlRepository } from "../../../infra/db/prisma/vehicle-repository/vehicle-repository";

export const makeVehicleRepository = (): VehicleMysqlRepository => new VehicleMysqlRepository(prisma);
