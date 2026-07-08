import { OrderDeliveryModel } from "../order-delivery/order-delivery";

export interface StoreModel {
  id: number
  name: string;
  Deliveries: OrderDeliveryModel[];
}
