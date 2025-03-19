import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";

export interface LoadOrderDeliveryRepository {
  getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]>;
}
