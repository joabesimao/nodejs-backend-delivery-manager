import { Address } from "../../../../domain/models/register/address-model";

import { UpdateAddressModel } from "../../../../domain/usescases/address/update-address";

export interface UpdateAddressRepository {
  update(id: number, infoToUpdate: UpdateAddressModel): Promise<Address>;
}
