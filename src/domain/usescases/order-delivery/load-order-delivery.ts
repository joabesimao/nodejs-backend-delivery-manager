import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import {
  DeliveryRankingFilter,
  DeliveryRankingModel,
  DeliveryRankingPaginatedModel,
} from "../../models/order-delivery/delivery-ranking";

export interface LoadOrderDelivery {
  loadAll(): Promise<OrderDeliveryModel[]>;
}

export interface LoadOrderDeliveryById {
  loadOne(id: number): Promise<OrderDeliveryModel>;
}

export interface LoadOrderDeliveryRanking {
  loadByPeriod(
    filter: DeliveryRankingFilter
  ): Promise<DeliveryRankingPaginatedModel>;
}
