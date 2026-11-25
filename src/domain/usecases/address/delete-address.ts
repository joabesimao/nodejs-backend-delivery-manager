export interface DeleteAddress {
  delete(id: number): Promise<string>;
}
