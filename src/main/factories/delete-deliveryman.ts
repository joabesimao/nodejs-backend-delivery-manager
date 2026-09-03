import { DbDeleteDeliveryman } from "../../data/usescases/deliveryman-usecases/delete-deliveryman/db-delete-deliveryman";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { DeleteDeliverymanController } from "../../presentation/controllers/deliveryman-controllers/delete-deliveryman/delete-deliveryman";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteDeliverymanController = (): Controller => {
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  const deleteDeliveryman = new DbDeleteDeliveryman(deliverymanRepository);
  return new DeleteDeliverymanController(deleteDeliveryman);
};
