import { DbLoadOrderDelivery } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery";
import { LoadOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/load-order-delivery/load-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { Controller } from "../../presentation/protocols/controller";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";

export const makeLoadOrdersDeliveryController = (): Controller => {
  const loadOrderDeliveryRepository = new OrderDeliveryMongoRepository();
  const listOrdersOfDelivery = new DbLoadOrderDelivery(
    loadOrderDeliveryRepository
  );
  const controller = new LoadOrderDeliveryController(listOrdersOfDelivery);
  return controller;
};
