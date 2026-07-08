import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import {
  AddDeliveryman,
  AddDeliverymanModel,
} from "../../../../domain/usescases/deliveryman/add-deliveryman";
import { AddDeliverymanRepository } from "../../../protocols/db/deliveryman/add-deliveryman";

export class DbAddDeliveryman implements AddDeliveryman {
  constructor(
    private readonly addDeliverymanRepository: AddDeliverymanRepository,
  ) {}

  async add(deliveryman: AddDeliverymanModel): Promise<Deliveryman> {
    return this.addDeliverymanRepository.add(deliveryman);
  }
}
