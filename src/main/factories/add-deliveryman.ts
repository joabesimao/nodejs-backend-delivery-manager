import { DbAddDeliveryman } from "../../data/usescases/deliveryman-usecases/add-deliveryman/db-add-deliveryman";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { AddDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/add-deliveryman/add-deliveryman";
import { Controller } from "../../presentation/protocols/controller";

export const makeAddDeliverymanController = (): Controller => {
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  const addDeliveryman = new DbAddDeliveryman(deliverymanRepository);
  return new AddDeliverymanController(addDeliveryman);
};
