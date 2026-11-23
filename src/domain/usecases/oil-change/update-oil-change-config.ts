import { OilChangeConfig } from "../../models/oil-change/oil-change-config-model";

export interface UpdateOilChangeConfigModel {
  intervalKm: number;
}

export interface UpdateOilChangeConfig {
  update(data: UpdateOilChangeConfigModel): Promise<OilChangeConfig>;
}
