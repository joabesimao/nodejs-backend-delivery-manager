import { OilChangeConfig } from "../../models/oil-change/oil-change-config-model";

export interface LoadOilChangeConfig {
  load(): Promise<OilChangeConfig>;
}
