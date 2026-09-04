import { UpdateProduct } from "../../../../domain/usescases/product/update-product/update-product";
import { ProductModel } from "../../../usescases/product-usecases/add-product-usecase/db-add-product-protocols";

export interface UpdateProductRepository {
  updateProduct(
    id: number,
    info: UpdateProduct
  ): Promise<ProductModel>;
}
