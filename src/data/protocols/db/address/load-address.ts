import { Address } from "../../../../domain/models/register/address-model";

export interface LoadAddressRepository {
  loadAll(): Promise<Address[]>;
}
