import { DbLoadOrderDeliveryRanking } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery-ranking";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { LoadOrderDeliveryRankingController } from "../../presentation/controllers/order-delivery-controllers/load-order-delivery-ranking/load-order-delivery-ranking";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadOrderDeliveryRankingController = (): Controller => {
  const orderDeliveryRepository = new OrderDeliveryMySqlRepository(prisma);
  const loadOrderDeliveryRanking = new DbLoadOrderDeliveryRanking(
    orderDeliveryRepository
  );

  return new LoadOrderDeliveryRankingController(loadOrderDeliveryRanking);
};
