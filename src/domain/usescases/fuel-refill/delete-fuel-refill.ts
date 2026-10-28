export interface DeleteFuelRefill {
  delete(id: number): Promise<boolean>;
}
