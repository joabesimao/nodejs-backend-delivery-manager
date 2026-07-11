export interface DeleteOrderDelivery {
  delete(id: number, accountId?: number): Promise<string>;
}
