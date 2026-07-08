import { DbLoadDeliveryman } from "../../data/usescases/deliveryman-usecases/load-deliveryman/db-load-deliveryman";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { LoadDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/load-deliveryman/load-deliveryman";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoadDeliverymanController = (): Controller => {
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  const loadDeliveryman = new DbLoadDeliveryman(deliverymanRepository);
  return new LoadDeliverymanController(loadDeliveryman);
};
