import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";

export interface FindLastOilChangeLogRepository {
  findLastByVehicle(vehicleId: number): Promise<OilChangeLog | null>;
}
