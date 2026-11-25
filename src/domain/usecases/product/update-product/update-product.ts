import { Product, ProductModel } from "../../../models/product/product";

export interface UpdateProduct {
  update(id: number, info: Partial<ProductModel>): Promise<Product>;
}
