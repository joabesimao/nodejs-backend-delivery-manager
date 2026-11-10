import { DbLoadAllProduct } from "../../data/usescases/product-usecases/load-product-usecase/load-product-usecase";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";
import { prisma } from "../../infra/db/prisma/client";
import { LoadProductController } from "../../presentation/controllers/product-controllers/load-product/load-product";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoadProductController = (): Controller => {
  const productRepository = new ProductMysqlRepository(prisma);
  const loadProduct = new DbLoadAllProduct(productRepository);
  return new LoadProductController(loadProduct);
};
