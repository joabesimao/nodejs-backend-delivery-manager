import { AddAddressController } from "../../presentation/controllers/address-controllers/add-address/add-address";
import { DbAddAddress } from "../../data/usescases/address-usecases/add-address/db-add-address";
import { Controller } from "../../presentation/protocols/controller";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddAddressController = (): Controller => {
  const addressRepository = new AddressMysqlRepository(prisma);
  const address = new DbAddAddress(addressRepository);
  const addressController = new AddAddressController(address);
  return addressController;
};
