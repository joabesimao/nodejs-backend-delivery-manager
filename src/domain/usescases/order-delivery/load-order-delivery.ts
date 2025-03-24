import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";

export interface LoadOrderDelivery {
  loadAll(): Promise<OrderDeliveryModel[]>;
}
