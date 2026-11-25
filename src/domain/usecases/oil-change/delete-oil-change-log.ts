export interface DeleteOilChangeLog {
  delete(id: number): Promise<boolean>;
}
