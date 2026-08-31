import { DbAddDeliveryman } from "../../data/usescases/deliveryman-usecases/add-deliveryman/db-add-deliveryman";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { AddDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/add-deliveryman/add-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddDeliverymanValidation } from "./add-deliveryman-validation";

export const makeAddDeliverymanController = (): Controller => {
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  const addDeliveryman = new DbAddDeliveryman(deliverymanRepository);
  const validation = makeAddDeliverymanValidation();
  return new AddDeliverymanController(addDeliveryman, validation);
};
