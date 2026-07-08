import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { AddDeliverymanModel } from "../../../../domain/usescases/deliveryman/add-deliveryman";

export interface AddDeliverymanRepository {
  add(deliveryman: AddDeliverymanModel): Promise<Deliveryman>;
}
