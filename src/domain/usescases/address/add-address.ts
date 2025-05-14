import { Address } from "../../models/register/address-model";

export interface AddAddressModel {
  street: string;
  neighborhood: string;
  numberHouse: number;
  reference: string;
  city: string;
}
export interface AddAddress {
  add(address: AddAddressModel): Promise<Address>;
}
