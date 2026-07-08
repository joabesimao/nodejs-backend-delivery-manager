import { RegisterModel } from "../register/register-model";
import { Deliveryman } from "../deliveryman/deliveryman-model";

export type OrderStatus = "actived" | "delivered" | "finished";

export interface OrderDeliveryModel {
  id: number;
  register: RegisterModel;
  deliveryman?: Deliveryman;
  quantity: string;
  amount: number;
  data: Date;
  status: OrderStatus;
}
