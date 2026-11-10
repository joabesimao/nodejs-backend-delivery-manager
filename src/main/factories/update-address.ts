import { DbUpdateAddress } from "../../data/usescases/address-usecases/update-address/db-update-address";
import { UpdateAddressController } from "../../presentation/controllers/address-controllers/update-address/update-address";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddressRepository } from "./repositories";

export const makeUpdateAddressController = (): Controller => {
  const updateAddressRepository = makeAddressRepository();
  const updateAddress = new DbUpdateAddress(updateAddressRepository);
  const addressController = new UpdateAddressController(updateAddress);
  return addressController;
};
