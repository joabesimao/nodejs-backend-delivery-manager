export interface DeleteVehicle {
  delete(id: number): Promise<string>;
}
