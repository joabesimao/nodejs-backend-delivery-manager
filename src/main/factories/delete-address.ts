import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteAddress } from "../../data/usescases/address-usecases/delete-address/db-delete-address";
import { DeleteAddressController } from "../../presentation/controllers/address-controllers/delete-address/delete-address-controlller";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteAddressController = (): Controller => {
  const deleteAddressRepository = new AddressMysqlRepository(prisma);
  const deleteAddress = new DbDeleteAddress(deleteAddressRepository);
  const deleteAddressController = new DeleteAddressController(deleteAddress);
  return deleteAddressController;
};
