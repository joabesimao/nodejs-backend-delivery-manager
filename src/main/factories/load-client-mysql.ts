import { DbLoadClients } from "../../data/usescases/client-usecases/load-client/db-load-client";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { LoadClientController } from "../../presentation/controllers/client-controllers/load-client/load-client";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadClientController = (): Controller => {
  const loadClientRepository = new ClientMysqlRepository(prisma);
  const listClient = new DbLoadClients(loadClientRepository);
  const controller = new LoadClientController(listClient);
  return controller;
};
