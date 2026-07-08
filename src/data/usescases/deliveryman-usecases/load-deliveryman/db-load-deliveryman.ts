import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { LoadDeliveryman } from "../../../../domain/usescases/deliveryman/load-deliveryman";
import { LoadDeliverymanRepository } from "../../../protocols/db/deliveryman/load-deliveryman";

export class DbLoadDeliveryman implements LoadDeliveryman {
  constructor(
    private readonly loadDeliverymanRepository: LoadDeliverymanRepository,
  ) {}

  async load(): Promise<Deliveryman[]> {
    return this.loadDeliverymanRepository.loadAll();
  }
}
