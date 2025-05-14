import { DbUpdateOrderDelivery } from "../../data/usescases/order-delivery/update-order-delivery/db--update-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { UpdateOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/update-order-delivery/update-order-delivery";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeUpdateOrderDeliveryController = (): Controller => {
  const updateRepository = new OrderDeliveryMySqlRepository(prisma);
  const updateOrderDelivery = new DbUpdateOrderDelivery(updateRepository);
  const orderDeliveryController = new UpdateOrderDeliveryController(
    updateOrderDelivery
  );
  return orderDeliveryController;
};
