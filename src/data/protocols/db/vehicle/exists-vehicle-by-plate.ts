export interface ExistsVehicleByPlateRepository {
  existsByPlate(plate: string): Promise<boolean>;
}
