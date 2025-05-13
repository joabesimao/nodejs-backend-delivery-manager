import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../protocols/db/order-delivery/update-order-delivery";

export class DbUpdateOrderDelivery implements UpdateOrderDelivery {
  constructor(
    private readonly orderDeliveryRepository: UpdateOrderDeliveryRepository
  ) {}

  async update(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const orderDeliveryUpdate = await this.orderDeliveryRepository.updateOrder(
      id,
      info
    );
    return orderDeliveryUpdate;
  }
}
