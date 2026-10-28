import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { LoadOilChangeConfig } from "../../../../domain/usescases/oil-change/load-oil-change-config";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";

export class DbLoadOilChangeConfig implements LoadOilChangeConfig {
  constructor(private readonly loadOilChangeConfigRepository: LoadOilChangeConfigRepository) {}
  async load(): Promise<OilChangeConfig> {
    return await this.loadOilChangeConfigRepository.load();
  }
}
