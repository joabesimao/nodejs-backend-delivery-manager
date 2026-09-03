import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { UpdateDeliveryman, UpdateDeliverymanModel } from "../../../../domain/usescases/deliveryman/update-deliveryman";
import { UpdateDeliverymanRepository } from "../../../protocols/db/deliveryman/update-deliveryman";

export class DbUpdateDeliveryman implements UpdateDeliveryman {
  constructor(private readonly updateDeliverymanRepository: UpdateDeliverymanRepository) {}

  async update(id: number, data: UpdateDeliverymanModel): Promise<Deliveryman> {
    return this.updateDeliverymanRepository.update(id, data);
  }
}
