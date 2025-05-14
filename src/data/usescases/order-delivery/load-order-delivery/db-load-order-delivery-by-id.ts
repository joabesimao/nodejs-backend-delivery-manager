import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { LoadOrderDeliveryById } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { LoadOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/load-order-delivery";

export class DbLoadOrderDeliveryById implements LoadOrderDeliveryById {
  constructor(
    private readonly loadOrderDeliveryRepositoryById: LoadOrderDeliveryByIdRepository
  ) {}
  async loadOne(id: number): Promise<OrderDeliveryModel> {
    const findRegister =
      await this.loadOrderDeliveryRepositoryById.getOneOrderOfDelivery(id);
    return findRegister;
  }
}
