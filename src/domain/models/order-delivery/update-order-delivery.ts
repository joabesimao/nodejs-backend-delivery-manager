import { OrderStatus } from "./order-delivery";

export interface UpdateOrderDeliveryModel {
  quantity: string;
  amount: number;
  status?: OrderStatus;
}
