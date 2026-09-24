import { DeleteOilChangeLog } from "../../../../domain/usescases/oil-change/delete-oil-change-log";
import { FindOilChangeLogByIdRepository } from "../../../protocols/db/oil-change/find-oil-change-log-by-id";
import { DeleteOilChangeLogRepository } from "../../../protocols/db/oil-change/delete-oil-change-log";

export class DbDeleteOilChangeLog implements DeleteOilChangeLog {
  constructor(
    private readonly findOilChangeLogByIdRepository: FindOilChangeLogByIdRepository,
    private readonly deleteOilChangeLogRepository: DeleteOilChangeLogRepository
  ) {}

  async delete(id: number): Promise<boolean> {
    const current = await this.findOilChangeLogByIdRepository.findLogById(id);
    if (!current) {
      return false;
    }
    await this.deleteOilChangeLogRepository.deleteLog(id);
    return true;
  }
}
