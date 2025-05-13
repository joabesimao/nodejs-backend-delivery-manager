import { AddClientController } from "../../presentation/controllers/client-controllers/add-client/add-client";
import { DbAddClient } from "../../data/usescases/client-usecases/add-client/db-add-client";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddRegisterValidation } from "./add-register-validation";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddClientController = (): Controller => {
  const clientRepository = new ClientMysqlRepository(prisma);
  const client = new DbAddClient(clientRepository);
  const clientController = new AddClientController(client);

  return clientController;
};
