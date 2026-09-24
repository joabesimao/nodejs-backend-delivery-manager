import { Controller } from "../../presentation/protocols/controller";
import { VehicleMysqlRepository } from "../../infra/db/mysql/vehicle-repository/vehicle-repository";
import { DbDeleteVehicle } from "../../data/usescases/vehicle-usecases/delete-vehicle/db-delete-vehicle";
import { DeleteVehicleController } from "../../presentation/controllers/vehicle-controllers/delete-vehicle/delete-vehicle";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteVehicleController = (): Controller => {
  const vehicleRepository = new VehicleMysqlRepository(prisma);
  const deleteVehicle = new DbDeleteVehicle(vehicleRepository);
  return new DeleteVehicleController(deleteVehicle);
};
