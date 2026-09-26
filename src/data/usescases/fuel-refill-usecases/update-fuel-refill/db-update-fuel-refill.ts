import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { UpdateFuelRefill, UpdateFuelRefillModel } from "../../../../domain/usescases/fuel-refill/update-fuel-refill";
import { FindFuelRefillByIdRepository } from "../../../protocols/db/fuel-refill/find-fuel-refill-by-id";
import { LoadFuelRefillRepository } from "../../../protocols/db/fuel-refill/load-fuel-refill";
import { UpdateFuelRefillRepository } from "../../../protocols/db/fuel-refill/update-fuel-refill";
import { RecalculateFuelRefillKmRepository } from "../../../protocols/db/fuel-refill/recalculate-fuel-refill-km";
import { isKmSequenceValid, KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbUpdateFuelRefill implements UpdateFuelRefill {
  constructor(
    private readonly findFuelRefillByIdRepository: FindFuelRefillByIdRepository,
    private readonly loadFuelRefillRepository: LoadFuelRefillRepository,
    private readonly updateFuelRefillRepository: UpdateFuelRefillRepository,
    private readonly recalculateFuelRefillKmRepository: RecalculateFuelRefillKmRepository
  ) {}

  async update(id: number, data: UpdateFuelRefillModel): Promise<FuelRefill | null> {
    const current = await this.findFuelRefillByIdRepository.findById(id);
    if (!current) {
      return null;
    }
    const merged = { ...current, ...data };
    const others = await this.loadFuelRefillRepository.loadAll({ vehicleId: merged.vehicleId });
    const entries = [
      ...others.filter((refill) => refill.id !== id).map((refill) => ({ id: refill.id, km: refill.km, date: refill.refillDate })),
      { id, km: merged.km, date: merged.refillDate },
    ];
    if (!isKmSequenceValid(entries)) {
      throw new InvalidKmError(KM_OUT_OF_ORDER_MESSAGE);
    }

    await this.updateFuelRefillRepository.update(id, data);
    await this.recalculateFuelRefillKmRepository.recalculateKmChain(merged.vehicleId);
    if (current.vehicleId !== merged.vehicleId) {
      await this.recalculateFuelRefillKmRepository.recalculateKmChain(current.vehicleId);
    }
    return await this.findFuelRefillByIdRepository.findById(id);
  }
}
