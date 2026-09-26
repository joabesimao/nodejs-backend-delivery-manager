import { OrderDeliveryModel } from "../../models/order-delivery/order-delivery";
import { DeliveryRankingFilter, DeliveryRankingPaginatedModel } from "../../models/order-delivery/delivery-ranking";

export interface LoadOrderDelivery {
  loadAll(accountId?: number): Promise<OrderDeliveryModel[]>;
}

export interface LoadOrderDeliveryById {
  loadOne(id: number, accountId?: number): Promise<OrderDeliveryModel>;
}

export interface LoadOrderDeliveryRanking {
  loadByPeriod(
    filter: DeliveryRankingFilter,
  ): Promise<DeliveryRankingPaginatedModel>;
}
