import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { DbAddOrderDelivery } from "../../data/usescases/order-delivery/db-add-order-delivery";
import { AddOrderDeliveryController } from "../../presentation/controllers/add-order-delivery/add-order-delivery";
import { makeAddOrderDeliveryValidation } from "./add-order-delivery-validation";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";

export const makeAddOrderDeliveryController = (): Controller => {
  const orderDeliveryRepository = new OrderDeliveryMySqlRepository();
  const addOrderDelivery = new DbAddOrderDelivery(orderDeliveryRepository);

  const addOrderDeliveryController = new AddOrderDeliveryController(
    addOrderDelivery
  );

  return addOrderDeliveryController;
};
