import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";

export interface UpdateVehicleRepository {
  update(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
}
