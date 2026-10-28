import { OilChangeLog } from "../../models/oil-change/oil-change-log-model";

export interface LoadOilChangeLogParams {
  vehicleId?: number;
  deliverymanId?: number;
}

export interface LoadOilChangeLog {
  load(params?: LoadOilChangeLogParams): Promise<OilChangeLog[]>;
}
