import { Product, ProductModel } from "../../../usecases/product-usecases/add-product-usecase/db-add-product-protocols";

export interface UpdateProductRepository {
  updateProduct(
    id: number,
    info: Partial<ProductModel>
  ): Promise<Product>;
}
