import { DbDeleteProduct } from "../../data/usescases/product-usecases/delete-product-usecase/db-delete-product";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";
import { prisma } from "../../infra/db/prisma/client";
import { DeleteProductController } from "../../presentation/controllers/product-controllers/delete-product/delete-product";
import { Controller } from "../../presentation/protocols/controller";

export const makeDeleteProductController = (): Controller => {
  const productRepository = new ProductMysqlRepository(prisma);
  const deleteProduct = new DbDeleteProduct(productRepository);
  return new DeleteProductController(deleteProduct);
};
