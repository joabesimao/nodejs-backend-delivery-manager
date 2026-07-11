export interface DeleteOrderDeliveryByIdRepository {
  deleteById(id: number, accountId?: number): Promise<string>;
}
