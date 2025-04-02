import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";

export interface LoadOrderDelivery {
  loadAll(): Promise<OrderDeliveryModel[]>;
}

export interface LoadOrderDeliveryById {
  loadOne(id: number): Promise<OrderDeliveryModel>;
}
