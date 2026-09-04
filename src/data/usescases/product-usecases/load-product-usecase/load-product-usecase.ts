import {
  LoadAllProduct,
  LoadProductRepository,
  Product,
} from "./db-load-product-usecase-protocols";

export class DbLoadAllProduct implements LoadAllProduct {
  constructor(private readonly addProductRepository: LoadProductRepository) {}

  async load(): Promise<Product[]> {
    const result = await this.addProductRepository.getAllProducts();
    return result;
  }
}


