import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import { RegisterModel } from "../../models/register/register-model";

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
