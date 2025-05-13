import { DbUpdateAddress } from "../../data/usescases/address-usecases/update-address/db-update-address";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";
import { UpdateAddressController } from "../../presentation/controllers/address-controllers/update-address/update-address";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeUpdateAddressController = (): Controller => {
  const updateAddressRepository = new AddressMysqlRepository();
  const updateAddress = new DbUpdateAddress(updateAddressRepository);
  const addressController = new UpdateAddressController(updateAddress);

  return addressController;
};
