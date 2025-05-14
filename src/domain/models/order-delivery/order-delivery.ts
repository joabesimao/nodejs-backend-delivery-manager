import { RegisterModel } from "../register/register-model";

export interface OrderDeliveryModel {
  register: RegisterModel;
  quantity: string;
  amount: number;
  data: Date;
}
