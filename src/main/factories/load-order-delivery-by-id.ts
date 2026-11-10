import { DbLoadOrderDeliveryById } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery-by-id";
import { LoadOrderDeliveryByIdController } from "../../presentation/controllers/order-delivery-controllers/load-by-id-order-delivery/load-order-delivery-by-id";
import { Controller } from "../../presentation/protocols/controller";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeLoadOrderByIdController = (): Controller => {
  const loadOrderByIdRepository = makeOrderDeliveryRepository();
  const dbOrderById = new DbLoadOrderDeliveryById(loadOrderByIdRepository);
  const controllerOrderById = new LoadOrderDeliveryByIdController(dbOrderById);
  return controllerOrderById;
};
