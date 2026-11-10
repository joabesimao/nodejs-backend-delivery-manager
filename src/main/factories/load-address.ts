import { Controller } from "../../presentation/protocols/controller";
import { DbLoadAddress } from "../../data/usescases/address-usecases/load-address/db-load-address";
import { LoadAddressController } from "../../presentation/controllers/address-controllers/load-address/load-address";
import { makeAddressRepository } from "./repositories";

export const makeLoadAddressController = (): Controller => {
  const loadAddressRepository = makeAddressRepository();
  const listAddress = new DbLoadAddress(loadAddressRepository);
  const controller = new LoadAddressController(listAddress);
  return controller;
};
