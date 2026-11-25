import { StoreModel } from "../../models/store/store-model";

export interface LoadOneStore {
  loadOneStore(id: number): Promise<StoreModel>;
}
