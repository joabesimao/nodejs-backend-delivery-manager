import { DbUpdateOrderDelivery } from "../../data/usescases/order-delivery/update-order-delivery/db--update-order-delivery";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { UpdateOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/update-order-delivery/update-order-delivery";
import { Controller } from "../../presentation/protocols/controller";

export const makeUpdateOrderDeliveryController = (): Controller => {
  const updateRepository = new OrderDeliveryMongoRepository();
  const updateOrderDelivery = new DbUpdateOrderDelivery(updateRepository);
  const orderDeliveryController = new UpdateOrderDeliveryController(
    updateOrderDelivery
  );
  return orderDeliveryController;
};
