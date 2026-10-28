import { Controller } from "../../presentation/protocols/controller";
import { VehicleMysqlRepository } from "../../infra/db/mysql/vehicle-repository/vehicle-repository";
import { DbAddVehicle } from "../../data/usescases/vehicle-usecases/add-vehicle/db-add-vehicle";
import { AddVehicleController } from "../../presentation/controllers/vehicle-controllers/add-vehicle/add-vehicle";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddVehicleValidation } from "./add-vehicle-validation";

export const makeAddVehicleController = (): Controller => {
  const vehicleRepository = new VehicleMysqlRepository(prisma);
  const addVehicle = new DbAddVehicle(vehicleRepository);
  const validation = makeAddVehicleValidation();
  return new AddVehicleController(addVehicle, validation);
};
