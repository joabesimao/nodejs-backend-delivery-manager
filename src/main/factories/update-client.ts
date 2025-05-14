import { DbUpdateClient } from "../../data/usescases/client-usecases/update-client/db-update-client";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { UpdateClientController } from "../../presentation/controllers/client-controllers/update-client/update-client-controller";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeUpdateClientController = (): Controller => {
  const updateClientRepository = new ClientMysqlRepository(prisma);
  const updateClient = new DbUpdateClient(updateClientRepository);
  const clientsController = new UpdateClientController(updateClient);
  return clientsController;
};
