import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateVehicle } from "../../data/usescases/vehicle-usecases/update-vehicle/db-update-vehicle";
import { UpdateVehicleController } from "../../presentation/controllers/vehicle-controllers/update-vehicle/update-vehicle";
import { makeUpdateVehicleValidation } from "./update-vehicle-validation";
import { makeVehicleRepository } from "./repositories";

export const makeUpdateVehicleController = (): Controller => {
  const vehicleRepository = makeVehicleRepository();
  const updateVehicle = new DbUpdateVehicle(vehicleRepository);
  const validation = makeUpdateVehicleValidation();
  return new UpdateVehicleController(updateVehicle, validation);
};
