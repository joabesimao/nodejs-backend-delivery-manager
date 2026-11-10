import { DbAddDeliveryman } from "../../data/usescases/deliveryman-usecases/add-deliveryman/db-add-deliveryman";
import { AddDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/add-deliveryman/add-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddDeliverymanValidation } from "./add-deliveryman-validation";
import { makeDeliverymanRepository } from "./repositories";

export const makeAddDeliverymanController = (): Controller => {
  const deliverymanRepository = makeDeliverymanRepository();
  const addDeliveryman = new DbAddDeliveryman(deliverymanRepository);
  const validation = makeAddDeliverymanValidation();
  return new AddDeliverymanController(addDeliveryman, validation);
};
