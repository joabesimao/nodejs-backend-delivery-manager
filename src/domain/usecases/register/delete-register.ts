export interface DeleteRegister {
  delete(id: number): Promise<string>;
}
