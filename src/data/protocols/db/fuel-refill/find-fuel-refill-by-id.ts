import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";

export interface FindFuelRefillByIdRepository {
  findById(id: number): Promise<FuelRefill | null>;
}
