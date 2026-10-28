import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { LoadOilChangeLogParams } from "../../../../domain/usescases/oil-change/load-oil-change-log";

export interface LoadOilChangeLogRepository {
  loadAll(params?: LoadOilChangeLogParams): Promise<OilChangeLog[]>;
}
