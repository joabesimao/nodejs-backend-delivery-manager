import { ActorContext } from "../../models/actor-context";
import { FuelRefill } from "../../models/fuel-refill/fuel-refill-model";

export interface AddFuelRefillModel {
  vehicleId: number;
  deliverymanId: number;
  km: number;
  liters: number;
  pricePerLiter: number;
  totalValue: number;
  refillDate: Date;
}

export interface AddFuelRefill {
  add(refill: AddFuelRefillModel, context?: ActorContext): Promise<FuelRefill>;
}
