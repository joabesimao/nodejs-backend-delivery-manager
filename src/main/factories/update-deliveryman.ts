import { DbUpdateDeliveryman } from "../../data/usescases/deliveryman-usecases/update-deliveryman/db-update-deliveryman";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { UpdateDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/update-deliveryman/update-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeUpdateDeliverymanValidation } from "./update-deliveryman-validation";

export const makeUpdateDeliverymanController = (): Controller => {
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  const updateDeliveryman = new DbUpdateDeliveryman(deliverymanRepository);
  const validation = makeUpdateDeliverymanValidation();
  return new UpdateDeliverymanController(updateDeliveryman, validation);
};
