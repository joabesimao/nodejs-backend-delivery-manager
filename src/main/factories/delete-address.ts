import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { DbDeleteAddress } from "../../data/usescases/address-usecases/delete-address/db-delete-address";
import { DeleteAddressController } from "../../presentation/controllers/address-controllers/delete-address/delete-address-controlller";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";

export const makeDeleteAddressController = (): Controller => {
  const deleteAddressRepository = new AddressMysqlRepository();
  const deleteAddress = new DbDeleteAddress(deleteAddressRepository);
  const deleteAddressController = new DeleteAddressController(deleteAddress);

  return deleteAddressController;
};
