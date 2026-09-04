export interface DeleteProductByIdRepository {
  deleteById(id: number): Promise<string>;
}
