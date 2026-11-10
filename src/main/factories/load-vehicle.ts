import { Controller } from "../../presentation/protocols/controller";
import { DbLoadVehicle } from "../../data/usescases/vehicle-usecases/load-vehicle/db-load-vehicle";
import { LoadVehicleController } from "../../presentation/controllers/vehicle-controllers/load-vehicle/load-vehicle";
import { makeVehicleRepository } from "./repositories";

export const makeLoadVehicleController = (): Controller => {
  const vehicleRepository = makeVehicleRepository();
  const loadVehicle = new DbLoadVehicle(vehicleRepository);
  return new LoadVehicleController(loadVehicle);
};
