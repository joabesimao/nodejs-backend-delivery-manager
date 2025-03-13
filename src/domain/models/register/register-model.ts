import { ClientModel } from "../client/client-model";
import { Address } from "./address-model";

export interface RegisterModel {
  id: number;
  client: ClientModel;
  address: Address;
}
