import {
  Product,
  ProductModel,
  UpdateProduct,
  UpdateProductRepository,
} from "./db-update-product-protocols";

export class DbUpdateProduct implements UpdateProduct {
  constructor(private readonly updateProductRepository: UpdateProductRepository) {}

  async update(id: number, info: Partial<ProductModel>): Promise<Product> {
    return await this.updateProductRepository.updateProduct(id, info);
  }
}
