import { FuelRefill } from "../../models/fuel-refill/fuel-refill-model";

export interface UpdateFuelRefillModel {
  vehicleId?: number;
  deliverymanId?: number;
  km?: number;
  liters?: number;
  pricePerLiter?: number;
  totalValue?: number;
  refillDate?: Date;
}

export interface UpdateFuelRefill {
  update(id: number, data: UpdateFuelRefillModel): Promise<FuelRefill | null>;
}
