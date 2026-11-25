import { Deliveryman } from "../../models/deliveryman/deliveryman-model";

export interface LoadDeliveryman {
  load(): Promise<Deliveryman[]>;
}
