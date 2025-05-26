import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";

export interface AddOrderDeliveryModel {
  registerId: number;
  quantity: string;
  amount: number;
  data: Date;
}

export interface AddOrderDelivery {
  addOrderDelivery(
    orderDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel>;
}
