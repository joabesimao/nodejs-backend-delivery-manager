import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";

export interface UpdateOilChangeConfigRepository {
  upsert(intervalKm: number): Promise<OilChangeConfig>;
}
