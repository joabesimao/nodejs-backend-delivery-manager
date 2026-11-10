import { Controller } from "../../presentation/protocols/controller";
import { DbAddVehicle } from "../../data/usescases/vehicle-usecases/add-vehicle/db-add-vehicle";
import { AddVehicleController } from "../../presentation/controllers/vehicle-controllers/add-vehicle/add-vehicle";
import { makeAddVehicleValidation } from "./add-vehicle-validation";
import { makeVehicleRepository } from "./repositories";

export const makeAddVehicleController = (): Controller => {
  const vehicleRepository = makeVehicleRepository();
  const addVehicle = new DbAddVehicle(vehicleRepository);
  const validation = makeAddVehicleValidation();
  return new AddVehicleController(addVehicle, validation);
};
