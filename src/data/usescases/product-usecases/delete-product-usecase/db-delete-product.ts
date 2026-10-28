import {
  DeleteProductById,
  DeleteProductByIdRepository,
} from "./db-delete-product-protocols";

export class DbDeleteProduct implements DeleteProductById {
  constructor(private readonly deleteProductRepository: DeleteProductByIdRepository) {}

  async delete(id: number): Promise<string> {
    return await this.deleteProductRepository.deleteById(id);
  }
}
