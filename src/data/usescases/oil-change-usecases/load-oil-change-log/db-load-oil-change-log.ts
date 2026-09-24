import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { LoadOilChangeLog, LoadOilChangeLogParams } from "../../../../domain/usescases/oil-change/load-oil-change-log";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";

export class DbLoadOilChangeLog implements LoadOilChangeLog {
  constructor(private readonly loadOilChangeLogRepository: LoadOilChangeLogRepository) {}
  async load(params?: LoadOilChangeLogParams): Promise<OilChangeLog[]> {
    return this.loadOilChangeLogRepository.loadAll(params);
  }
}
