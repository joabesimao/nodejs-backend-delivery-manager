import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { DbLoadOrderDelivery } from "../../data/usescases/order-delivery/db-load-order-delivery";
import { LoadOrderDeliveryController } from "../../presentation/controllers/load-order-delivery/load-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";

export const makeLoadOrdersDeliveryController = (): Controller => {
  const loadOrderDeliveryRepository = new OrderDeliveryMySqlRepository();
  const listOrdersOfDelivery = new DbLoadOrderDelivery(
    loadOrderDeliveryRepository
  );
  const controller = new LoadOrderDeliveryController(listOrdersOfDelivery);
  return controller; /* 
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logErrorRepository); */
};
