import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { AddDeliverymanModel } from "../../../../domain/usecases/deliveryman/add-deliveryman";

export interface AddDeliverymanRepository {
  add(deliveryman: AddDeliverymanModel): Promise<Deliveryman>;
}
