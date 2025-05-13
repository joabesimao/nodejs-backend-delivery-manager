import { Address } from "../../../../domain/models/register/address-model";
import { LoadAddress } from "../../../../domain/usescases/address/load-address";
import { LoadAddressRepository } from "../../../protocols/db/address/load-address";

export class DbLoadAddress implements LoadAddress {
  constructor(private readonly loadAddressRepository: LoadAddressRepository) {}
  async load(): Promise<Address[]> {
    const loadAllAddress = await this.loadAddressRepository.loadAll();
    return loadAllAddress;
  }
}
