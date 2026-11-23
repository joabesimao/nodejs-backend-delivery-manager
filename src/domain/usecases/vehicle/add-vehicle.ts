import { Vehicle } from "../../models/vehicle/vehicle-model";

export interface AddVehicleModel {
  plate: string;
  model: string;
  brand?: string;
  deliverymanId?: number;
}

export interface AddVehicle {
  add(vehicle: AddVehicleModel): Promise<Vehicle>;
}
