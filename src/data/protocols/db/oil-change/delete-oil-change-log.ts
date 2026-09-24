export interface DeleteOilChangeLogRepository {
  deleteLog(id: number): Promise<void>;
}
