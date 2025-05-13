import { DbLoadOneClient } from "../../data/usescases/client-usecases/load-client/db-load-one-client";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { LoadOneClientController } from "../../presentation/controllers/client-controllers/load-one-client/load-one-client";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadOneClientController = (): Controller => {
  const loadClientRepository = new ClientMysqlRepository(prisma);
  const listClient = new DbLoadOneClient(loadClientRepository);
  const controller = new LoadOneClientController(listClient);
  return controller;
};
