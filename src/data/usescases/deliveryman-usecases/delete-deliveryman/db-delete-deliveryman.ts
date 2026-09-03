import { DeleteDeliveryman } from "../../../../domain/usescases/deliveryman/delete-deliveryman";
import { DeleteDeliverymanRepository } from "../../../protocols/db/deliveryman/delete-deliveryman";

export class DbDeleteDeliveryman implements DeleteDeliveryman {
  constructor(private readonly deleteDeliverymanRepository: DeleteDeliverymanRepository) {}

  async delete(id: number): Promise<string> {
    return this.deleteDeliverymanRepository.deleteOne(id);
  }
}
