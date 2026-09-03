import { Deliveryman } from "../../models/deliveryman/deliveryman-model";

export interface UpdateDeliverymanModel {
  name?: string;
  lastName?: string;
  phone?: string;
  numberQualification?: string;
}

export interface UpdateDeliveryman {
  update(id: number, data: UpdateDeliverymanModel): Promise<Deliveryman>;
}
