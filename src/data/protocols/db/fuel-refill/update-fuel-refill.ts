import { UpdateFuelRefillModel } from "../../../../domain/usescases/fuel-refill/update-fuel-refill";

export interface UpdateFuelRefillRepository {
  update(id: number, data: UpdateFuelRefillModel): Promise<void>;
}
