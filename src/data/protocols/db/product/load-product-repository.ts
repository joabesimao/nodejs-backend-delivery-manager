import { Product } from "../../../usescases/product-usecases/add-product-usecase/db-add-product-protocols";
import { LoadProductFilter, LoadProductResult } from "../../../../domain/models/product/product";

export interface LoadProductRepository {
  getAllProducts(filter?: LoadProductFilter): Promise<LoadProductResult>;
}

export interface LoadProductByIdRepository {
  getOneProduct(
    id: number,
    productId?: number,
  ): Promise<Product>;
}
