import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicleModel } from "../../../../domain/usecases/vehicle/add-vehicle";

export interface AddVehicleRepository {
  add(vehicle: AddVehicleModel): Promise<Vehicle>;
}
