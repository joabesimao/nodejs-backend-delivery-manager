import { DbLoadOrderDeliveryById } from "../../data/usescases/order-delivery/db-load-order-delivery-by-id";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { LoadOrderDeliveryByIdController } from "../../presentation/controllers/order-delivery-controllers/load-by-id-order-delivery/load-order-delivery-by-id";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeLoadOrderByIdController = (): Controller => {
  const loadOrderByIdRepository = new OrderDeliveryMySqlRepository();
  const dbOrderById = new DbLoadOrderDeliveryById(loadOrderByIdRepository);
  const controllerOrderById = new LoadOrderDeliveryByIdController(dbOrderById);
  return controllerOrderById;
};
