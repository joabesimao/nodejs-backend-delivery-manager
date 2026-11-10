import { DbAddProduct } from "../../data/usescases/product-usecases/add-product-usecase/add-product";
import { AddProductController } from "../../presentation/controllers/product-controllers/add-product/add-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddProductValidation } from "./add-product-validation";
import { makeProductRepository } from "./repositories";

export const makeAddProductController = (): Controller => {
  const productRepository = makeProductRepository();
  const addProduct = new DbAddProduct(productRepository);
  const validation = makeAddProductValidation();
  return new AddProductController(addProduct, validation);
};
