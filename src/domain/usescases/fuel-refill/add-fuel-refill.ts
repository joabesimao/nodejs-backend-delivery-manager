import { FuelRefill } from "../../models/fuel-refill/fuel-refill-model";

export interface AddFuelRefillModel {
  vehicleId: number;
  deliverymanId: number;
  km: number;
  liters: number;
  totalValue: number;
  refillDate: Date;
}

export interface AddFuelRefill {
  add(refill: AddFuelRefillModel): Promise<FuelRefill>;
}
