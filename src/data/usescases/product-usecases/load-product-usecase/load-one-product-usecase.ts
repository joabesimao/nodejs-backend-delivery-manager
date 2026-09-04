import {LoadProductById,LoadProductByIdRepository,Product,ProductModel
} from "./db-load-product-usecase-protocols";

export class DbLoadOneProduct implements LoadProductById {
  constructor(private readonly addProductRepository: LoadProductByIdRepository) {}
    async loadOne(id: number): Promise<Product> {
          const result = await this.addProductRepository.getOneProduct(id);
    return result;
    }

  
}


