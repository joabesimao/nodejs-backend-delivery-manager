import {
  DeliveryRankingFilter,
  DeliveryRankingPaginatedModel,
} from "../../../../domain/models/order-delivery/delivery-ranking";
import { LoadOrderDeliveryRanking } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { LoadOrderDeliveryRankingRepository } from "../../../protocols/db/order-delivery/load-order-delivery";

export class DbLoadOrderDeliveryRanking implements LoadOrderDeliveryRanking {
  constructor(
    private readonly loadOrderDeliveryRankingRepository: LoadOrderDeliveryRankingRepository
  ) {}

  async loadByPeriod(
    filter: DeliveryRankingFilter
  ): Promise<DeliveryRankingPaginatedModel> {
    return this.loadOrderDeliveryRankingRepository.getDeliverymanRankingByPeriod(
      filter
    );
  }
}
