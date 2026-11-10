import { DbLoadAllProduct } from "../../data/usescases/product-usecases/load-product-usecase/load-product-usecase";
import { LoadProductController } from "../../presentation/controllers/product-controllers/load-product/load-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeProductRepository } from "./repositories";

export const makeLoadProductController = (): Controller => {
  const productRepository = makeProductRepository();
  const loadProduct = new DbLoadAllProduct(productRepository);
  return new LoadProductController(loadProduct);
};
