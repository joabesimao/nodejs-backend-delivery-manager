import { Address } from "../../../../domain/models/register/address-model";
import {
  AddAddress,
  AddAddressModel,
} from "../../../../domain/usescases/address/add-address";
import { AddAddressRepository } from "../../../protocols/db/address/add-address";

export class DbAddAddress implements AddAddress {
  constructor(private readonly addAddressRepository: AddAddressRepository) {}
  async add(address: AddAddressModel): Promise<Address> {
    const result = await this.addAddressRepository.add(address);
    return result;
  }
}
