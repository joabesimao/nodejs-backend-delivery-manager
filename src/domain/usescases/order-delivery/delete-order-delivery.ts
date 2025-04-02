export interface DeleteOrderDelivery {
  delete(id: number): Promise<string>;
}
