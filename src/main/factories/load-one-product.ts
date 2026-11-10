import { DbLoadOneProduct } from "../../data/usescases/product-usecases/load-product-usecase/load-one-product-usecase";
import { LoadOneProductController } from "../../presentation/controllers/product-controllers/load-one-product/load-one-product";
import { Controller } from "../../presentation/protocols/controller";
import { makeProductRepository } from "./repositories";

export const makeLoadOneProductController = (): Controller => {
  const productRepository = makeProductRepository();
  const loadOneProduct = new DbLoadOneProduct(productRepository);
  return new LoadOneProductController(loadOneProduct);
};
