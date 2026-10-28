import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { LoadVehicle } from "../../../../domain/usescases/vehicle/load-vehicle";
import { LoadVehicleRepository } from "../../../protocols/db/vehicle/load-vehicle";

export class DbLoadVehicle implements LoadVehicle {
  constructor(private readonly loadVehicleRepository: LoadVehicleRepository) {}
  async load(): Promise<Vehicle[]> {
    return await this.loadVehicleRepository.loadAll();
  }
}
