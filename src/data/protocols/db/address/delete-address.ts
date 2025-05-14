export interface DeleteAddressRepository {
  deleteOne(id: number): Promise<string>;
}
