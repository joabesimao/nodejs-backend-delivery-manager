import { DeleteAddress } from "../../../../domain/usescases/address/delete-address";
import { DeleteAddressRepository } from "../../../protocols/db/address/delete-address";

export class DbDeleteAddress implements DeleteAddress {
  constructor(
    private readonly deleteAddressRepository: DeleteAddressRepository
  ) {}

  async delete(id: number): Promise<string> {
    const deletedAddress = await this.deleteAddressRepository.deleteOne(id);
    return deletedAddress;
  }
}
