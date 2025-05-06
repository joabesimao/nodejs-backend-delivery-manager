import { Address } from "../../models/register/address-model";

export interface LoadAddress {
  load(): Promise<Address[]>;
}
