import { Deliveryman } from "../../models/deliveryman/deliveryman-model";

export interface AddDeliverymanModel {
  name: string;
  lastName: string;
  phone: string;
}

export interface AddDeliveryman {
  add(deliveryman: AddDeliverymanModel): Promise<Deliveryman>;
}
