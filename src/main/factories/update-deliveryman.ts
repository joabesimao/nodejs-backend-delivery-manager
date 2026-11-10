import { DbUpdateDeliveryman } from "../../data/usescases/deliveryman-usecases/update-deliveryman/db-update-deliveryman";
import { UpdateDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/update-deliveryman/update-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { makeUpdateDeliverymanValidation } from "./update-deliveryman-validation";
import { makeDeliverymanRepository } from "./repositories";

export const makeUpdateDeliverymanController = (): Controller => {
  const deliverymanRepository = makeDeliverymanRepository();
  const updateDeliveryman = new DbUpdateDeliveryman(deliverymanRepository);
  const validation = makeUpdateDeliverymanValidation();
  return new UpdateDeliverymanController(updateDeliveryman, validation);
};
