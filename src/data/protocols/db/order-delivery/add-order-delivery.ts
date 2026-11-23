import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usecases/order-delivery/add-order-delivery";

export interface AddOrderDeliveryRepository {
  addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel,
  ): Promise<OrderDeliveryModel>;
}
