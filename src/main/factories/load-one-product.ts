import { DbLoadOneProduct } from "../../data/usescases/product-usecases/load-product-usecase/load-one-product-usecase";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";
import { prisma } from "../../infra/db/prisma/client";
import { LoadOneProductController } from "../../presentation/controllers/product-controllers/load-one-product/load-one-product";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoadOneProductController = (): Controller => {
  const productRepository = new ProductMysqlRepository(prisma);
  const loadOneProduct = new DbLoadOneProduct(productRepository);
  return new LoadOneProductController(loadOneProduct);
};
