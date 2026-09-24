import { Vehicle } from "../vehicle/vehicle-model";
import { Deliveryman } from "../deliveryman/deliveryman-model";

export interface FuelRefill {
  id: number;
  vehicleId: number;
  deliverymanId: number;
  km: number;
  previousKm?: number;
  kmDriven?: number;
  liters: number;
  totalValue: number;
  refillDate: Date;
  createdAt: Date;
  vehicle?: Vehicle;
  deliveryman?: Deliveryman;
}
