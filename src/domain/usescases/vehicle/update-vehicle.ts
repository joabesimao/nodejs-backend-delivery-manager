import { Vehicle } from "../../models/vehicle/vehicle-model";

export interface UpdateVehicleModel {
  plate?: string;
  model?: string;
  brand?: string;
  deliverymanId?: number;
}

export interface UpdateVehicle {
  update(id: number, data: UpdateVehicleModel): Promise<Vehicle>;
}
