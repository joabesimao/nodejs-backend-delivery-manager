import { prisma } from "../../../infra/db/prisma/client";
import { DeliverymanMysqlRepository } from "../../../infra/db/prisma/deliveryman-repository/deliveryman-repository";

export const makeDeliverymanRepository = (): DeliverymanMysqlRepository => new DeliverymanMysqlRepository(prisma);
