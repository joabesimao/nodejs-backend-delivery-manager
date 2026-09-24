import { Controller } from "../../presentation/protocols/controller";
import { VehicleMysqlRepository } from "../../infra/db/mysql/vehicle-repository/vehicle-repository";
import { DbLoadVehicle } from "../../data/usescases/vehicle-usecases/load-vehicle/db-load-vehicle";
import { LoadVehicleController } from "../../presentation/controllers/vehicle-controllers/load-vehicle/load-vehicle";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadVehicleController = (): Controller => {
  const vehicleRepository = new VehicleMysqlRepository(prisma);
  const loadVehicle = new DbLoadVehicle(vehicleRepository);
  return new LoadVehicleController(loadVehicle);
};
