import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteAddress } from "../../data/usescases/address-usecases/delete-address/db-delete-address";
import { DeleteAddressController } from "../../presentation/controllers/address-controllers/delete-address/delete-address-controlller";
import { makeAddressRepository } from "./repositories";

export const makeDeleteAddressController = (): Controller => {
  const deleteAddressRepository = makeAddressRepository();
  const deleteAddress = new DbDeleteAddress(deleteAddressRepository);
  const deleteAddressController = new DeleteAddressController(deleteAddress);
  return deleteAddressController;
};
