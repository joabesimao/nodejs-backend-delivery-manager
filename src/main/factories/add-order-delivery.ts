import { Controller } from "../../presentation/protocols/controller";
import { DbAddOrderDelivery } from "../../data/usescases/order-delivery/add-order-delivery/db-add-order-delivery";
import { AddOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/add-order-delivery/add-order-delivery";
import { makeAddOrderDeliveryValidation } from "./add-order-delivery-validation";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { LogControllerDecorator } from "../decorators/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";

export const makeAddOrderDeliveryController = (): Controller => {
  const orderDeliveryRepository = new OrderDeliveryMongoRepository();
  const addOrderDelivery = new DbAddOrderDelivery(orderDeliveryRepository);
  const orderDelivery = makeAddOrderDeliveryValidation();
  const addOrderDeliveryController = new AddOrderDeliveryController(
    addOrderDelivery,
    orderDelivery
  );
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(addOrderDeliveryController, logError);
};
