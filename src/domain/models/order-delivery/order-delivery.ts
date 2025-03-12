import { RegisterModel } from "../register/register-model";

export interface OrderDeliveryModel {
  id: string;
  register: RegisterModel;
  quantity: string;
  amount: number;
  data: Date;
}
