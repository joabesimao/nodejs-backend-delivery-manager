import { DbUpdateOrderDelivery } from "../../data/usescases/order-delivery/update-order-delivery/db--update-order-delivery";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { UpdateOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/update-order-delivery/update-order-delivery";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeUpdateOrderDeliveryController = (): Controller => {
  const updateRepository = new OrderDeliveryMySqlRepository();
  const updateOrderDelivery = new DbUpdateOrderDelivery(updateRepository);
  const orderDeliveryController = new UpdateOrderDeliveryController(
    updateOrderDelivery
  );

  return orderDeliveryController;
};
