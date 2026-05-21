import { RegisterModel } from "../register/register-model";

export interface OrderDeliveryModel {
  id: number;
  register: RegisterModel;
  quantity: string;
  amount: number;
  data: Date;
}
