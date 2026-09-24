import { FuelRefill } from "../../models/fuel-refill/fuel-refill-model";

export interface LoadFuelRefillParams {
  vehicleId?: number;
  deliverymanId?: number;
}

export interface LoadFuelRefill {
  load(params?: LoadFuelRefillParams): Promise<FuelRefill[]>;
}
