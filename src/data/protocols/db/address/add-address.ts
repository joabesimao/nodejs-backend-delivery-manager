import { Address } from "../../../../domain/models/register/address-model";
import { AddAddressModel } from "../../../../domain/usescases/address/add-address";

export interface AddAddressRepository {
  add(address: AddAddressModel): Promise<Address>;
}
