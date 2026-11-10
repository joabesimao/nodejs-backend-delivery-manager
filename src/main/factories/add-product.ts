import { DbAddProduct } from "../../data/usescases/product-usecases/add-product-usecase/add-product";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";
import { prisma } from "../../infra/db/prisma/client";
import { AddProductController } from "../../presentation/controllers/product-controllers/add-product/add-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddProductValidation } from "./add-product-validation";

export const makeAddProductController = (): Controller => {
  const productRepository = new ProductMysqlRepository(prisma);
  const addProduct = new DbAddProduct(productRepository);
  const validation = makeAddProductValidation();
  return new AddProductController(addProduct, validation);
};
