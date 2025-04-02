export interface DeleteOrderDeliveryByIdRepository {
  deleteById(id: number): Promise<string>;
}
