import { ClientModel } from "../client/client-model";
import { AddressModel } from "./address-model";

export interface RegisterModel {
  id: number;
  client: ClientModel;
  address: AddressModel;
  quantity: string;
  ammount: number;
}
