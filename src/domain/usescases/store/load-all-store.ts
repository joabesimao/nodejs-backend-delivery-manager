import { StoreModel } from "../../models/store/store-model";

export interface LoadAllStore {
  loadAll(): Promise<StoreModel[]>;
}
