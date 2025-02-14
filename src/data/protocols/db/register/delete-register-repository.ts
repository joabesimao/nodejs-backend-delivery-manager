export interface DeleteRegisterByIdRepository {
  deleteById(id: number): Promise<string>;
}
