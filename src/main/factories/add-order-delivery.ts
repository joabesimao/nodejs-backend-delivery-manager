import { Controller } from "../../presentation/protocols/controller";
import { DbAddOrderDelivery } from "../../data/usescases/order-delivery/add-order-delivery/db-add-order-delivery";
import { AddOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/add-order-delivery/add-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddOrderDeliveryValidation } from "./add-order-delivery-validation";

export const makeAddOrderDeliveryController =  (): Controller => {
  const orderDeliveryRepository = new OrderDeliveryMySqlRepository(prisma);
  const addOrderDelivery = new DbAddOrderDelivery(orderDeliveryRepository);
  const orderDelivery = makeAddOrderDeliveryValidation();
  const addOrderDeliveryController = new AddOrderDeliveryController(
    addOrderDelivery,
    orderDelivery
  );
  return addOrderDeliveryController;
};
