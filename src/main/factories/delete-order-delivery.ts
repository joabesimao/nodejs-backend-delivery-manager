import { Controller } from "../../presentation/protocols/controller";
import { DbdeleteOrderDelivery } from "../../data/usescases/order-delivery/delete-order-delivery/db-delete-order-delivery";
import { DeleteOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/delete-order-delivery/delete-order-delivery";
import { OrderDeliveryMySqlRepository } from "../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";
import { OrderDeliveryMongoRepository } from "../../infra/db/mongodb/order-delivery-repository/order-delivery-repository";

export const makeDeleteOrderDeliveryController = (): Controller => {
  const deleteOrderDeliveryRepository = new OrderDeliveryMongoRepository();
  const deleteOrderDelivery = new DbdeleteOrderDelivery(
    deleteOrderDeliveryRepository
  );
  const deleteOrderDeliveryController = new DeleteOrderDeliveryController(
    deleteOrderDelivery
  );
  return deleteOrderDeliveryController;
};
