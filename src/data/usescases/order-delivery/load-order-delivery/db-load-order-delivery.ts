import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { LoadOrderDelivery } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { LoadOrderDeliveryRepository } from "../../../protocols/db/order-delivery/load-order-delivery";

export class DbLoadOrderDelivery implements LoadOrderDelivery {
  constructor(
    private readonly loadOrderDeliveryRepository: LoadOrderDeliveryRepository
  ) {}
  async loadAll(): Promise<OrderDeliveryModel[]> {
    const orders =
      await this.loadOrderDeliveryRepository.getAllOrderOfDelivery();
    return orders;
  }
}
