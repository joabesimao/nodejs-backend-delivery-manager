import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";

export interface AddFuelRefillRepository {
  add(data: {
    vehicleId: number;
    deliverymanId: number;
    km: number;
    previousKm?: number;
    kmDriven?: number;
    liters: number;
    pricePerLiter: number;
    totalValue: number;
    refillDate: Date;
  }): Promise<FuelRefill>;
}
