export interface DeleteVehicleRepository {
  deleteOne(id: number): Promise<string>;
}
