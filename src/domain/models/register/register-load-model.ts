import { ClientModel } from "../client/client-model";
import { Address } from "./address-model";
export interface LoadRegisterModel {
  id: number;
  client: ClientModel;
  address: Address;
  
}
