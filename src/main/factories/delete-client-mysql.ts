import { DeleteClientController } from "../../presentation/controllers/client-controllers/delete-client/delete-client";
import { DbDeleteClient } from "../../data/usescases/client-usecases/delete-client/db-delete-client";
import { Controller } from "../../presentation/protocols/controller";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteClientController = (): Controller => {
  const deleteClientRepository = new ClientMysqlRepository(prisma);
  const deleteClient = new DbDeleteClient(deleteClientRepository);
  const deleteClientController = new DeleteClientController(deleteClient);
  return deleteClientController;
};
