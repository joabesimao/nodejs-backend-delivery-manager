import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";

export interface FindLastFuelRefillRepository {
  findLastByVehicle(vehicleId: number): Promise<FuelRefill | null>;
}
