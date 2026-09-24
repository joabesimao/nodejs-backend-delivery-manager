export interface DeleteFuelRefillRepository {
  deleteOne(id: number): Promise<void>;
}
