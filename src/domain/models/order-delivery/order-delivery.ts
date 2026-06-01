import { RegisterModel } from "../register/register-model";

export type OrderStatus = "actived" | "delivered" | "finished";

export interface OrderDeliveryModel {
  id: number;
  register: RegisterModel;
  quantity: string;
  amount: number;
  data: Date;
  status: OrderStatus;
}
