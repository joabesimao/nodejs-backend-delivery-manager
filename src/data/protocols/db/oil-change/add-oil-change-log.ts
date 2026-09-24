import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";

export interface AddOilChangeLogRepository {
  add(data: {
    vehicleId: number;
    deliverymanId: number;
    km: number;
    nextChangeKm: number;
    changeDate: Date;
  }): Promise<OilChangeLog>;
}
