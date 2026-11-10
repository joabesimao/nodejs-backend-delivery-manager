import { Controller } from "../../presentation/protocols/controller";
import { DbAddOrderDelivery } from "../../data/usescases/order-delivery/add-order-delivery/db-add-order-delivery";
import { AddOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/add-order-delivery/add-order-delivery";
import { makeAddOrderDeliveryValidation } from "./add-order-delivery-validation";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeAddOrderDeliveryController = (): Controller => {
  const orderDeliveryRepository = makeOrderDeliveryRepository();
  const addOrderDelivery = new DbAddOrderDelivery(orderDeliveryRepository);
  const orderDelivery = makeAddOrderDeliveryValidation();
  const addOrderDeliveryController = new AddOrderDeliveryController(
    addOrderDelivery,
    orderDelivery
  );
  return addOrderDeliveryController;
};
