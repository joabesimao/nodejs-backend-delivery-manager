import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";

export interface UpdateOrderDeliveryRepository {
  updateOrder(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel>;
}
