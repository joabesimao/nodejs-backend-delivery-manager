import { AddClientController } from "../../presentation/controllers/client-controllers/add-client/add-client";
import { DbAddClient } from "../../data/usescases/client-usecases/add-client/db-add-client";
import { Controller } from "../../presentation/protocols/controller";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddClientController = (): Controller => {
  const clientRepository = new ClientMysqlRepository(prisma);
  const client = new DbAddClient(clientRepository);
  const clientController = new AddClientController(client);
  return clientController;
};
