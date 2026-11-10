import { DbDeleteDeliveryman } from "../../data/usescases/deliveryman-usecases/delete-deliveryman/db-delete-deliveryman";
import { DeleteDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/delete-deliveryman/delete-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { makeDeliverymanRepository } from "./repositories";

export const makeDeleteDeliverymanController = (): Controller => {
  const deliverymanRepository = makeDeliverymanRepository();
  const deleteDeliveryman = new DbDeleteDeliveryman(deliverymanRepository);
  return new DeleteDeliverymanController(deleteDeliveryman);
};
