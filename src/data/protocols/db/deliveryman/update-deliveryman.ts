import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";

export interface UpdateDeliverymanRepository {
  update(id: number, data: Partial<Deliveryman>): Promise<Deliveryman>;
}
