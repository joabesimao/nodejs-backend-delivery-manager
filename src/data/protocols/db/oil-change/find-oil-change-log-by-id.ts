import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";

export interface FindOilChangeLogByIdRepository {
  findLogById(id: number): Promise<OilChangeLog | null>;
}
