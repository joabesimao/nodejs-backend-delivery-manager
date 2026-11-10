import { DbLoadDeliveryman } from "../../data/usescases/deliveryman-usecases/load-deliveryman/db-load-deliveryman";
import { LoadDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/load-deliveryman/load-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { makeDeliverymanRepository } from "./repositories";

export const makeLoadDeliverymanController = (): Controller => {
  const deliverymanRepository = makeDeliverymanRepository();
  const loadDeliveryman = new DbLoadDeliveryman(deliverymanRepository);
  return new LoadDeliverymanController(loadDeliveryman);
};
