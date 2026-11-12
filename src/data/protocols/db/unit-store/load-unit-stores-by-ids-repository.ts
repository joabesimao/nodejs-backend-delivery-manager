import { UnitStoreSummary } from "../../../../domain/models/store/unit-store-summary";

export interface LoadUnitStoresByIdsRepository {
  loadByIds(ids: number[]): Promise<UnitStoreSummary[]>;
}
