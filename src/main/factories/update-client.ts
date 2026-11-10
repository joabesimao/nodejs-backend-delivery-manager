import { DbUpdateClient } from "../../data/usescases/client-usecases/update-client/db-update-client";
import { UpdateClientController } from "../../presentation/controllers/client-controllers/update-client/update-client-controller";
import { Controller } from "../../presentation/protocols/controller";
import { makeClientRepository } from "./repositories";

export const makeUpdateClientController = (): Controller => {
  const updateClientRepository = makeClientRepository();
  const updateClient = new DbUpdateClient(updateClientRepository);
  const clientsController = new UpdateClientController(updateClient);
  return clientsController;
};
