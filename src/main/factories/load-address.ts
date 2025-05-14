import { Controller } from "../../presentation/protocols/controller";
import { AddressMysqlRepository } from "../../infra/db/mysql/address-repository/address-repository";
import { DbLoadAddress } from "../../data/usescases/address-usecases/load-address/db-load-address";
import { LoadAddressController } from "../../presentation/controllers/address-controllers/load-address/load-address";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadAddressController = (): Controller => {
  const loadAddressRepository = new AddressMysqlRepository(prisma);
  const listAddress = new DbLoadAddress(loadAddressRepository);
  const controller = new LoadAddressController(listAddress);
  return controller;
};
