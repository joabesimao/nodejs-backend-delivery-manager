import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefill, AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { AddFuelRefillRepository } from "../../../protocols/db/fuel-refill/add-fuel-refill";
import { LoadFuelRefillRepository } from "../../../protocols/db/fuel-refill/load-fuel-refill";
import { RecalculateFuelRefillKmRepository } from "../../../protocols/db/fuel-refill/recalculate-fuel-refill-km";
import { findKmNeighbors, isKmBetweenNeighbors, KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbAddFuelRefill implements AddFuelRefill {
  constructor(
    private readonly loadFuelRefillRepository: LoadFuelRefillRepository,
    private readonly addFuelRefillRepository: AddFuelRefillRepository,
    private readonly recalculateFuelRefillKmRepository: RecalculateFuelRefillKmRepository
  ) {}

  async add(refill: AddFuelRefillModel): Promise<FuelRefill> {
    const others = await this.loadFuelRefillRepository.loadAll({ vehicleId: refill.vehicleId });
    const neighbors = findKmNeighbors(
      others.map((other) => ({ id: other.id, km: other.km, date: other.refillDate })),
      refill.refillDate
    );
    if (!isKmBetweenNeighbors(neighbors, refill.km)) {
      throw new InvalidKmError(neighbors.next ? KM_OUT_OF_ORDER_MESSAGE : undefined);
    }

    const previousKm = neighbors.previous?.km;
    const kmDriven = previousKm !== undefined ? refill.km - previousKm : undefined;
    const created = await this.addFuelRefillRepository.add({ ...refill, previousKm, kmDriven });
    if (neighbors.next) {
      await this.recalculateFuelRefillKmRepository.recalculateKmChain(refill.vehicleId);
    }
    return created;
  }
}
