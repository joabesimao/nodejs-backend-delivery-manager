import { DeleteClientController } from "../../presentation/controllers/client-controllers/delete-client/delete-client";
import { DbDeleteClient } from "../../data/usescases/client-usecases/delete-client/db-delete-client";
import { Controller } from "../../presentation/protocols/controller";
import { makeClientRepository } from "./repositories";

export const makeDeleteClientController = (): Controller => {
  const deleteClientRepository = makeClientRepository();
  const deleteClient = new DbDeleteClient(deleteClientRepository);
  const deleteClientController = new DeleteClientController(deleteClient);
  return deleteClientController;
};
