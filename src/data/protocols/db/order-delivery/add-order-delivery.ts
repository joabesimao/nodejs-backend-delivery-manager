import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/order-delivery";

export interface AddOrderDeliveryRepository {
  addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel>;
}
