import { DbUpdateAddress } from "../../data/usescases/address-usecases/update-address/db-update-address";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";
import { UpdateAddressController } from "../../presentation/controllers/address-controllers/update-address/update-address";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeUpdateAddressController = (): Controller => {
  const updateAddressRepository = new AddressMysqlRepository(prisma);
  const updateAddress = new DbUpdateAddress(updateAddressRepository);
  const addressController = new UpdateAddressController(updateAddress);
  return addressController;
};
