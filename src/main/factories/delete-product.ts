import { DbDeleteProduct } from "../../data/usescases/product-usecases/delete-product-usecase/db-delete-product";
import { DeleteProductController } from "../../presentation/controllers/product-controllers/delete-product/delete-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeProductRepository } from "./repositories";

export const makeDeleteProductController = (): Controller => {
  const productRepository = makeProductRepository();
  const deleteProduct = new DbDeleteProduct(productRepository);
  return new DeleteProductController(deleteProduct);
};
