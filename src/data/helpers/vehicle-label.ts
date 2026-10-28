import { Vehicle } from "../../domain/models/vehicle/vehicle-model";

export const formatKm = (km: number): string => `${km.toLocaleString("pt-BR")} km`;

export const describeVehicle = (vehicle: Vehicle | undefined, vehicleId: number): string =>
  vehicle ? `${vehicle.model} (${vehicle.plate})` : `Veículo #${vehicleId}`;
