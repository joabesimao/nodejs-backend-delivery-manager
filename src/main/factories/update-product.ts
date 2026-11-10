import { DbUpdateProduct } from "../../data/usescases/product-usecases/update-product-usecase/db-update-product";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";
import { prisma } from "../../infra/db/prisma/client";
import { UpdateProductController } from "../../presentation/controllers/product-controllers/update-product/update-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeUpdateProductValidation } from "./update-product-validation";

export const makeUpdateProductController = (): Controller => {
  const productRepository = new ProductMysqlRepository(prisma);
  const updateProduct = new DbUpdateProduct(productRepository);
  const validation = makeUpdateProductValidation();
  return new UpdateProductController(updateProduct, validation);
};
