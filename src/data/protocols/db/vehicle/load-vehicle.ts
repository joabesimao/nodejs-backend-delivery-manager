import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";

export interface LoadVehicleRepository {
  loadAll(): Promise<Vehicle[]>;
}
