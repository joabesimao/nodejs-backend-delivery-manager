import { RegisterModel } from "../register/register-model";

export interface OrderDelivery {
  id: string;
  register: RegisterModel;
  quantity: string;
  amount: number;
  data: Date;
}
