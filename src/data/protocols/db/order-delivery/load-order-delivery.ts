import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import {
  DeliveryRankingFilter,
  DeliveryRankingPaginatedModel,
} from "../../../../domain/models/order-delivery/delivery-ranking";

export interface LoadOrderDeliveryRepository {
  getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]>;
}

export interface LoadOrderDeliveryByIdRepository {
  getOneOrderOfDelivery(id: number): Promise<OrderDeliveryModel>;
}

export interface LoadOrderDeliveryRankingRepository {
  getDeliverymanRankingByPeriod(
    filter: DeliveryRankingFilter
  ): Promise<DeliveryRankingPaginatedModel>;
}
