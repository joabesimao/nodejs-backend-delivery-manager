import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { DbAddOrderDelivery } from "../../data/usescases/order-delivery/db-add-order-delivery";
import { AddOrderDeliveryController } from "../../presentation/controllers/add-order-delivery/add-order-delivery";

export const makeAddOrderDeliveryController = (): Controller => {
  const orderDeliveryRepository = new OrderDeliveryMongoRepository();
  const addOrderDelivery = new DbAddOrderDelivery(orderDeliveryRepository);
  const addOrderDeliveryController = new AddOrderDeliveryController(
    addOrderDelivery
  );
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(
    addOrderDeliveryController,
    logErrorRepository
  );
};
