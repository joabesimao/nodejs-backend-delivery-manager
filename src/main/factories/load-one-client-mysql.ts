import { DbLoadOneClient } from "../../data/usescases/client-usecases/load-client/db-load-one-client";
import { LoadOneClientController } from "../../presentation/controllers/client-controllers/load-one-client/load-one-client";
import { Controller } from "../../presentation/protocols/controller";
import { makeClientRepository } from "./repositories";

export const makeLoadOneClientController = (): Controller => {
  const loadClientRepository = makeClientRepository();
  const listClient = new DbLoadOneClient(loadClientRepository);
  const controller = new LoadOneClientController(listClient);
  return controller;
};
