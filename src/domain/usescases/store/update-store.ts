import { partial } from "zod/mini";
import { StoreModel } from "../../models/store/store-model";

export interface UpdateStore {
  updateStore(id: number, data: StoreModel): Promise<Partial<StoreModel>>;
}
