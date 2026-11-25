import { OilChangeLog } from "../../models/oil-change/oil-change-log-model";

export interface UpdateOilChangeLogModel {
  vehicleId?: number;
  deliverymanId?: number;
  km?: number;
  changeDate?: Date;
}

export interface UpdateOilChangeLog {
  update(id: number, data: UpdateOilChangeLogModel): Promise<OilChangeLog | null>;
}
