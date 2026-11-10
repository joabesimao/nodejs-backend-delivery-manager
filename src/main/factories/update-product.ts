import { DbUpdateProduct } from "../../data/usescases/product-usecases/update-product-usecase/db-update-product";
import { UpdateProductController } from "../../presentation/controllers/product-controllers/update-product/update-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeUpdateProductValidation } from "./update-product-validation";
import { makeProductRepository } from "./repositories";

export const makeUpdateProductController = (): Controller => {
  const productRepository = makeProductRepository();
  const updateProduct = new DbUpdateProduct(productRepository);
  const validation = makeUpdateProductValidation();
  return new UpdateProductController(updateProduct, validation);
};
