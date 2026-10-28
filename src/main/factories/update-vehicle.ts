import { Controller } from "../../presentation/protocols/controller";
import { VehicleMysqlRepository } from "../../infra/db/mysql/vehicle-repository/vehicle-repository";
import { DbUpdateVehicle } from "../../data/usescases/vehicle-usecases/update-vehicle/db-update-vehicle";
import { UpdateVehicleController } from "../../presentation/controllers/vehicle-controllers/update-vehicle/update-vehicle";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeUpdateVehicleValidation } from "./update-vehicle-validation";

export const makeUpdateVehicleController = (): Controller => {
  const vehicleRepository = new VehicleMysqlRepository(prisma);
  const updateVehicle = new DbUpdateVehicle(vehicleRepository);
  const validation = makeUpdateVehicleValidation();
  return new UpdateVehicleController(updateVehicle, validation);
};
