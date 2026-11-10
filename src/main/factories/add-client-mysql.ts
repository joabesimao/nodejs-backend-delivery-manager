import { AddClientController } from "../../presentation/controllers/client-controllers/add-client/add-client";
import { DbAddClient } from "../../data/usescases/client-usecases/add-client/db-add-client";
import { Controller } from "../../presentation/protocols/controller";
import { makeClientRepository } from "./repositories";

export const makeAddClientController = (): Controller => {
  const clientRepository = makeClientRepository();
  const client = new DbAddClient(clientRepository);
  const clientController = new AddClientController(client);
  return clientController;
};
