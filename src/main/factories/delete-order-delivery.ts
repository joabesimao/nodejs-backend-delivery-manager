import { Controller } from "../../presentation/protocols/controller";
import { DbdeleteOrderDelivery } from "../../data/usescases/order-delivery/delete-order-delivery/db-delete-order-delivery";
import { DeleteOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/delete-order-delivery/delete-order-delivery";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeDeleteOrderDeliveryController = (): Controller => {
  const deleteOrderDeliveryRepository = makeOrderDeliveryRepository();
  const deleteOrderDelivery = new DbdeleteOrderDelivery(
    deleteOrderDeliveryRepository
  );
  const deleteOrderDeliveryController = new DeleteOrderDeliveryController(
    deleteOrderDelivery
  );
  return deleteOrderDeliveryController;
};
