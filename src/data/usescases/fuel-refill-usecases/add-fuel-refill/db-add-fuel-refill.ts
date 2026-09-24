import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefill, AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { AddFuelRefillRepository } from "../../../protocols/db/fuel-refill/add-fuel-refill";
import { FindLastFuelRefillRepository } from "../../../protocols/db/fuel-refill/find-last-fuel-refill";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbAddFuelRefill implements AddFuelRefill {
  constructor(
    private readonly findLastFuelRefillRepository: FindLastFuelRefillRepository,
    private readonly addFuelRefillRepository: AddFuelRefillRepository
  ) {}

  async add(refill: AddFuelRefillModel): Promise<FuelRefill> {
    const lastRefill = await this.findLastFuelRefillRepository.findLastByVehicle(refill.vehicleId);
    if (lastRefill && refill.km <= lastRefill.km) {
      throw new InvalidKmError();
    }
    const previousKm = lastRefill ? lastRefill.km : undefined;
    const kmDriven = previousKm !== undefined ? refill.km - previousKm : undefined;
    return this.addFuelRefillRepository.add({ ...refill, previousKm, kmDriven });
  }
}
