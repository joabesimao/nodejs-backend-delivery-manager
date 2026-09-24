import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { UpdateVehicle, UpdateVehicleModel } from "../../../../domain/usescases/vehicle/update-vehicle";
import { UpdateVehicleRepository } from "../../../protocols/db/vehicle/update-vehicle";

export class DbUpdateVehicle implements UpdateVehicle {
  constructor(private readonly updateVehicleRepository: UpdateVehicleRepository) {}

  async update(id: number, data: UpdateVehicleModel): Promise<Vehicle> {
    return this.updateVehicleRepository.update(id, data);
  }
}
