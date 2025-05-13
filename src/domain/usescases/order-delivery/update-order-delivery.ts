import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../models/order-delivery/update-order-delivery";

export interface UpdateOrderDelivery {
  update(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel>;
}
