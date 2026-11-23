import {
  LoadAllProduct,
  LoadProductRepository,
  LoadProductFilter,
  LoadProductResult,
} from "./db-load-product-usecase-protocols";

export class DbLoadAllProduct implements LoadAllProduct {
  constructor(private readonly addProductRepository: LoadProductRepository) {}

  async load(filter?: LoadProductFilter): Promise<LoadProductResult> {
    const result = await this.addProductRepository.getAllProducts(filter);
    return result;
  }
}
