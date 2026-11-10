import { DbLoadClients } from "../../data/usescases/client-usecases/load-client/db-load-client";
import { LoadClientController } from "../../presentation/controllers/client-controllers/load-client/load-client";
import { Controller } from "../../presentation/protocols/controller";
import { makeClientRepository } from "./repositories";

export const makeLoadClientController = (): Controller => {
  const loadClientRepository = makeClientRepository();
  const listClient = new DbLoadClients(loadClientRepository);
  const controller = new LoadClientController(listClient);
  return controller;
};
