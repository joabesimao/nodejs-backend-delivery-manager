import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import { StoreModel } from "../../models/store/store-model";

export interface AddStoreModel {
  name: string;
  deliveries: OrderDeliveryModel[];
}

export interface AddStore {
  add(data: AddStoreModel): Promise<StoreModel>;
}
