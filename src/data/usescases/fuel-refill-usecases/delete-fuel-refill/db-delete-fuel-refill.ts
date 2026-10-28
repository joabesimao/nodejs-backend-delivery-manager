import { DeleteFuelRefill } from "../../../../domain/usescases/fuel-refill/delete-fuel-refill";
import { FindFuelRefillByIdRepository } from "../../../protocols/db/fuel-refill/find-fuel-refill-by-id";
import { DeleteFuelRefillRepository } from "../../../protocols/db/fuel-refill/delete-fuel-refill";
import { RecalculateFuelRefillKmRepository } from "../../../protocols/db/fuel-refill/recalculate-fuel-refill-km";

export class DbDeleteFuelRefill implements DeleteFuelRefill {
  constructor(
    private readonly findFuelRefillByIdRepository: FindFuelRefillByIdRepository,
    private readonly deleteFuelRefillRepository: DeleteFuelRefillRepository,
    private readonly recalculateFuelRefillKmRepository: RecalculateFuelRefillKmRepository
  ) {}

  async delete(id: number): Promise<boolean> {
    const current = await this.findFuelRefillByIdRepository.findById(id);
    if (!current) {
      return false;
    }
    await this.deleteFuelRefillRepository.deleteOne(id);
    await this.recalculateFuelRefillKmRepository.recalculateKmChain(current.vehicleId);
    return true;
  }
}
