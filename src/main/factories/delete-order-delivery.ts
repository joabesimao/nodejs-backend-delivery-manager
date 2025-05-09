import { Controller } from "../../presentation/protocols/controller";
import { DbdeleteOrderDelivery } from "../../data/usescases/order-delivery/db-delete-order-delivery";
import { DeleteOrderDeliveryController } from "../../presentation/controllers/delete-order-delivery/delete-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";

export const makeDeleteOrderDeliveryController = (): Controller => {
  const deleteOrderDeliveryRepository = new OrderDeliveryMySqlRepository();
  const deleteOrderDelivery = new DbdeleteOrderDelivery(
    deleteOrderDeliveryRepository
  );
  const deleteOrderDeliveryController = new DeleteOrderDeliveryController(
    deleteOrderDelivery
  );
  return deleteOrderDeliveryController;
};
