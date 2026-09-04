import { AddProduct, AddProductModel, AddProductRepository, Product } from "./db-add-product-protocols";


export class DbAddProduct implements AddProduct {
  constructor(private readonly addProductRepository: AddProductRepository) {}
  async add(product: AddProductModel): Promise<Product> {
    const result = await this.addProductRepository.add(product);
    return result;
  }
}
