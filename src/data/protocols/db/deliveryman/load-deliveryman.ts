import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";

export interface LoadDeliverymanRepository {
  loadAll(): Promise<Deliveryman[]>;
}
