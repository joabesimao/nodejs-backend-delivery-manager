import { DbLoadOrderDeliveryRanking } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery-ranking";
import { LoadOrderDeliveryRankingController } from "../../presentation/controllers/order-delivery-controllers/load-order-delivery-ranking/load-order-delivery-ranking";
import { Controller } from "../../presentation/protocols/controller";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeLoadOrderDeliveryRankingController = (): Controller => {
  const orderDeliveryRepository = makeOrderDeliveryRepository();
  const loadOrderDeliveryRanking = new DbLoadOrderDeliveryRanking(
    orderDeliveryRepository
  );

  return new LoadOrderDeliveryRankingController(loadOrderDeliveryRanking);
};
