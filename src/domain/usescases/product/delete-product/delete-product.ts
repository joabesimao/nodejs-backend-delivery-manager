export interface DeleteProductById {
  delete(id: number): Promise<string>;
}
