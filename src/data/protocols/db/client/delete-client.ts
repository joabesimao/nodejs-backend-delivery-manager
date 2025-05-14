export interface DeleteClientRepository {
  deleteOne(id: number): Promise<string>;
}
