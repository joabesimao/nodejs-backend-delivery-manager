import { OilChangeLog } from "../../models/oil-change/oil-change-log-model";

export interface AddOilChangeLogModel {
  vehicleId: number;
  deliverymanId: number;
  km: number;
  changeDate: Date;
}

export interface AddOilChangeLog {
  add(log: AddOilChangeLogModel): Promise<OilChangeLog>;
}
