export interface DeleteDeliverymanRepository {
  deleteOne(id: number): Promise<string>;
}
