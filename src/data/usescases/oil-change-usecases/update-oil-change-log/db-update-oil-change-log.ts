import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { UpdateOilChangeLog, UpdateOilChangeLogModel } from "../../../../domain/usescases/oil-change/update-oil-change-log";
import { FindOilChangeLogByIdRepository } from "../../../protocols/db/oil-change/find-oil-change-log-by-id";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";
import { UpdateOilChangeLogRepository } from "../../../protocols/db/oil-change/update-oil-change-log";
import { isKmSequenceValid, KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

export class DbUpdateOilChangeLog implements UpdateOilChangeLog {
  constructor(
    private readonly findOilChangeLogByIdRepository: FindOilChangeLogByIdRepository,
    private readonly loadOilChangeLogRepository: LoadOilChangeLogRepository,
    private readonly updateOilChangeLogRepository: UpdateOilChangeLogRepository
  ) {}

  async update(id: number, data: UpdateOilChangeLogModel): Promise<OilChangeLog | null> {
    const current = await this.findOilChangeLogByIdRepository.findLogById(id);
    if (!current) {
      return null;
    }
    const merged = { ...current, ...data };
    const others = await this.loadOilChangeLogRepository.loadAll({ vehicleId: merged.vehicleId });
    const entries = [
      ...others.filter((log) => log.id !== id).map((log) => ({ id: log.id, km: log.km, date: log.changeDate })),
      { id, km: merged.km, date: merged.changeDate },
    ];
    if (!isKmSequenceValid(entries)) {
      throw new InvalidKmError(KM_OUT_OF_ORDER_MESSAGE);
    }
    const intervalKm = current.nextChangeKm - current.km;
    return await this.updateOilChangeLogRepository.updateLog(id, { ...data, nextChangeKm: merged.km + intervalKm });
  }
}
