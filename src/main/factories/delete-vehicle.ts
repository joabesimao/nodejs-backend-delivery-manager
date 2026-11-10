import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteVehicle } from "../../data/usescases/vehicle-usecases/delete-vehicle/db-delete-vehicle";
import { DeleteVehicleController } from "../../presentation/controllers/vehicle-controllers/delete-vehicle/delete-vehicle";
import { makeVehicleRepository } from "./repositories";

export const makeDeleteVehicleController = (): Controller => {
  const vehicleRepository = makeVehicleRepository();
  const deleteVehicle = new DbDeleteVehicle(vehicleRepository);
  return new DeleteVehicleController(deleteVehicle);
};
