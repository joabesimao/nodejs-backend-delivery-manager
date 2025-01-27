import { Client } from "../../models/client/client-model";
import { Address } from "../../models/register/address-model";
import { RegisterModel } from "../../models/register/register-model";

export interface AddRegisterModel {
  client: Client;
  address: Address;
  quantity: string;
  amount: number;
}

export interface AddRegister {
  add(data: AddRegisterModel): Promise<RegisterModel>;
}
