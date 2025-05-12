import { Address } from "../../models/register/address-model";

export interface UpdateAddressModel {
  street: string;
  neighborhood: string;
  numberHouse: number;
  reference: string;
  city: string;
}

export interface UpdateAddress {
  update(id: number, infoToUpdate: UpdateAddressModel): Promise<Address>;
}
