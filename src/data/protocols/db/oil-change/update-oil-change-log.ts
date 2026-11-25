import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { UpdateOilChangeLogModel } from "../../../../domain/usecases/oil-change/update-oil-change-log";

export interface UpdateOilChangeLogRepository {
  updateLog(id: number, data: UpdateOilChangeLogModel & { nextChangeKm: number }): Promise<OilChangeLog>;
}
