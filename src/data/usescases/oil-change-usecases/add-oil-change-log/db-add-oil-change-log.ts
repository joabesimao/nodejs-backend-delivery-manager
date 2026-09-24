import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddOilChangeLog, AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { AddOilChangeLogRepository } from "../../../protocols/db/oil-change/add-oil-change-log";
import { FindLastOilChangeLogRepository } from "../../../protocols/db/oil-change/find-last-oil-change-log";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbAddOilChangeLog implements AddOilChangeLog {
  constructor(
    private readonly loadOilChangeConfigRepository: LoadOilChangeConfigRepository,
    private readonly findLastOilChangeLogRepository: FindLastOilChangeLogRepository,
    private readonly addOilChangeLogRepository: AddOilChangeLogRepository
  ) {}

  async add(log: AddOilChangeLogModel): Promise<OilChangeLog> {
    const lastLog = await this.findLastOilChangeLogRepository.findLastByVehicle(log.vehicleId);
    if (lastLog && log.km <= lastLog.km) {
      throw new InvalidKmError();
    }
    const config = await this.loadOilChangeConfigRepository.load();
    const nextChangeKm = log.km + config.intervalKm;
    return this.addOilChangeLogRepository.add({ ...log, nextChangeKm });
  }
}
