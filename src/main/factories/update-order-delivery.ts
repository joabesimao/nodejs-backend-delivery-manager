import { DbUpdateOrderDelivery } from "../../data/usescases/order-delivery/update-order-delivery/db--update-order-delivery";
import { UpdateOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/update-order-delivery/update-order-delivery";
import { Controller } from "../../presentation/protocols/controller";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeUpdateOrderDeliveryController = (): Controller => {
  const updateRepository = makeOrderDeliveryRepository();
  const updateOrderDelivery = new DbUpdateOrderDelivery(
    updateRepository,
    updateRepository
  );
  const orderDeliveryController = new UpdateOrderDeliveryController(
    updateOrderDelivery
  );
  return orderDeliveryController;
};
