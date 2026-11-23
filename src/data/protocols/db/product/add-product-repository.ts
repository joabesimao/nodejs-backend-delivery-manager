import { AddProductModel } from "../../../../domain/usecases/product/add-product/add-product";
import { Product } from "../../../usecases/product-usecases/add-product-usecase/db-add-product-protocols";

export interface AddProductRepository {
  add(dataInfo: AddProductModel): Promise<Product>;
}
