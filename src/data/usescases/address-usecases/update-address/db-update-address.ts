import { Address } from "../../../../domain/models/register/address-model";
import {
  UpdateAddress,
  UpdateAddressModel,
} from "../../../../domain/usescases/address/update-address";
import { UpdateAddressRepository } from "../../../protocols/db/address/update-address";

export class DbUpdateAddress implements UpdateAddress {
  constructor(
    private readonly updateAddressRepository: UpdateAddressRepository
  ) {}

  async update(id: number, infoToUpdate: UpdateAddressModel): Promise<Address> {
    const updateOneAddress = await this.updateAddressRepository.update(
      id,
      infoToUpdate
    );
    return updateOneAddress;
  }
}
