import { Vehicle } from "../../models/vehicle/vehicle-model";

export interface LoadVehicle {
  load(): Promise<Vehicle[]>;
}
