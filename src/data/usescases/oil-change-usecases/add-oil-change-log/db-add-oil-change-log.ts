import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddOilChangeLog, AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { AddOilChangeLogRepository } from "../../../protocols/db/oil-change/add-oil-change-log";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";
import { findKmNeighbors, isKmBetweenNeighbors, KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbAddOilChangeLog implements AddOilChangeLog {
  constructor(
    private readonly loadOilChangeConfigRepository: LoadOilChangeConfigRepository,
    private readonly loadOilChangeLogRepository: LoadOilChangeLogRepository,
    private readonly addOilChangeLogRepository: AddOilChangeLogRepository
  ) {}

  async add(log: AddOilChangeLogModel): Promise<OilChangeLog> {
    const others = await this.loadOilChangeLogRepository.loadAll({ vehicleId: log.vehicleId });
    const neighbors = findKmNeighbors(
      others.map((other) => ({ id: other.id, km: other.km, date: other.changeDate })),
      log.changeDate
    );
    if (!isKmBetweenNeighbors(neighbors, log.km)) {
      throw new InvalidKmError(neighbors.next ? KM_OUT_OF_ORDER_MESSAGE : undefined);
    }
    const config = await this.loadOilChangeConfigRepository.load();
    const nextChangeKm = log.km + config.intervalKm;
    return await this.addOilChangeLogRepository.add({ ...log, nextChangeKm });
  }
}
