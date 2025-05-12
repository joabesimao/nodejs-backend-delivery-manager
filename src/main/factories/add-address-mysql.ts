import { AddAddressController } from "../../presentation/controllers/address-controllers/add-address/add-address";
import { DbAddAddress } from "../../data/usescases/add-address/db-add-address";
import { Controller } from "../../presentation/protocols/controller";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";

export const makeAddAddressController = (): Controller => {
  const addressRepository = new AddressMysqlRepository();
  const address = new DbAddAddress(addressRepository);
  const addressController = new AddAddressController(address);
  return addressController;
};
