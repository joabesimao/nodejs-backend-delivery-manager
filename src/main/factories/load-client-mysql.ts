import { DbLoadClients } from "../../data/usescases/load-client/db-load-client";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { LoadClientController } from "../../presentation/controllers/client-controllers/load-client/load-client";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoadClientController = (): Controller => {
  const loadClientRepository = new ClientMysqlRepository();
  const listClient = new DbLoadClients(loadClientRepository);
  const controller = new LoadClientController(listClient);
  return controller;
};
