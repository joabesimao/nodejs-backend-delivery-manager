import { Vehicle } from "../vehicle/vehicle-model";
import { Deliveryman } from "../deliveryman/deliveryman-model";

export interface OilChangeLog {
  id: number;
  vehicleId: number;
  deliverymanId: number;
  km: number;
  nextChangeKm: number;
  changeDate: Date;
  createdAt: Date;
  vehicle?: Vehicle;
  deliveryman?: Deliveryman;
}
