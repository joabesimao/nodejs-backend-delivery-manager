import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { LoadFuelRefill, LoadFuelRefillParams } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";
import { LoadFuelRefillRepository } from "../../../protocols/db/fuel-refill/load-fuel-refill";

export class DbLoadFuelRefill implements LoadFuelRefill {
  constructor(private readonly loadFuelRefillRepository: LoadFuelRefillRepository) {}
  async load(params?: LoadFuelRefillParams): Promise<FuelRefill[]> {
    return this.loadFuelRefillRepository.loadAll(params);
  }
}
