import { DeleteVehicle } from "../../../../domain/usescases/vehicle/delete-vehicle";
import { DeleteVehicleRepository } from "../../../protocols/db/vehicle/delete-vehicle";

export class DbDeleteVehicle implements DeleteVehicle {
  constructor(private readonly deleteVehicleRepository: DeleteVehicleRepository) {}

  async delete(id: number): Promise<string> {
    return this.deleteVehicleRepository.deleteOne(id);
  }
}
