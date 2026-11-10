import { prisma } from "../../../infra/db/prisma/client";
import { OrderDeliveryMySqlRepository } from "../../../infra/db/mysql/order-delivery-repository/order-delivery-mysql-repository";

export const makeOrderDeliveryRepository = (): OrderDeliveryMySqlRepository => new OrderDeliveryMySqlRepository(prisma);
