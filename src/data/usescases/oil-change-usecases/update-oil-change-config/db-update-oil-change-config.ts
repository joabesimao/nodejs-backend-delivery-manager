import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { UpdateOilChangeConfig, UpdateOilChangeConfigModel } from "../../../../domain/usescases/oil-change/update-oil-change-config";
import { UpdateOilChangeConfigRepository } from "../../../protocols/db/oil-change/update-oil-change-config";

export class DbUpdateOilChangeConfig implements UpdateOilChangeConfig {
  constructor(private readonly updateOilChangeConfigRepository: UpdateOilChangeConfigRepository) {}
  async update(data: UpdateOilChangeConfigModel): Promise<OilChangeConfig> {
    return this.updateOilChangeConfigRepository.upsert(data.intervalKm);
  }
}
