import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import { RegisterModel } from "../../models/register/register-model";

export interface AddOrderDeliveryModel {
  quantity: string;
  amount: number;
  data: Date;
}

export interface AddOrderDelivery {
  addOrderDelivery(
    orderDelivery: AddOrderDeliveryModel,
    id: number
  ): Promise<OrderDeliveryModel>;
}
