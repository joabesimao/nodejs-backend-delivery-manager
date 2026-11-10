import { prisma } from "../../../infra/db/prisma/client";
import { ProductMysqlRepository } from "../../../infra/db/mysql/product-repository/product-repository";

export const makeProductRepository = (): ProductMysqlRepository => new ProductMysqlRepository(prisma);
