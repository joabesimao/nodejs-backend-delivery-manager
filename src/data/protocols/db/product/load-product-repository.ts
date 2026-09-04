import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { Product, ProductModel } from "../../../usescases/product-usecases/add-product-usecase/db-add-product-protocols";

export interface LoadProductRepository {
  getAllProducts(productId?: number): Promise<Product[]>;
}

export interface LoadProductByIdRepository {
  getOneProduct(
    id: number,
    productId?: number,
  ): Promise<Product>;
}

