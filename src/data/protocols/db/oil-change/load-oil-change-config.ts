import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";

export interface LoadOilChangeConfigRepository {
  load(): Promise<OilChangeConfig>;
}
