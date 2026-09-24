import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { LoadFuelRefillParams } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";

export interface LoadFuelRefillRepository {
  loadAll(params?: LoadFuelRefillParams): Promise<FuelRefill[]>;
}
