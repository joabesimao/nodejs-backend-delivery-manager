import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicle, AddVehicleModel } from "../../../../domain/usescases/vehicle/add-vehicle";
import { AddVehicleRepository } from "../../../protocols/db/vehicle/add-vehicle";

export class DbAddVehicle implements AddVehicle {
  constructor(private readonly addVehicleRepository: AddVehicleRepository) {}
  async add(vehicle: AddVehicleModel): Promise<Vehicle> {
    return await this.addVehicleRepository.add(vehicle);
  }
}
