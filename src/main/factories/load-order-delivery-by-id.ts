import { DbLoadOrderDeliveryById } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery-by-id";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { LoadOrderDeliveryByIdController } from "../../presentation/controllers/order-delivery-controllers/load-by-id-order-delivery/load-order-delivery-by-id";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadOrderByIdController = (): Controller => {
  const loadOrderByIdRepository = new OrderDeliveryMySqlRepository(prisma);
  const dbOrderById = new DbLoadOrderDeliveryById(loadOrderByIdRepository);
  const controllerOrderById = new LoadOrderDeliveryByIdController(dbOrderById);
  return controllerOrderById;
};
